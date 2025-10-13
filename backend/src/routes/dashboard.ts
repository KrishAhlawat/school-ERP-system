import express from 'express'
import { prisma } from '../server'
import { asyncHandler } from '../middlewares/errorHandler'
import { AuthRequest } from '../middlewares/auth'
import { TenantRequest } from '../middlewares/tenant'

const router = express.Router()

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', asyncHandler(async (req: AuthRequest & TenantRequest, res) => {
  const { schoolId } = req
  const { user } = req

  if (!schoolId) {
    return res.status(400).json({
      success: false,
      message: 'School context required',
    })
  }

  // Get basic statistics
  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    totalExams,
  ] = await Promise.all([
    prisma.student.count({
      where: { schoolId, isActive: true },
    }),
    prisma.teacher.count({
      where: { schoolId, isActive: true },
    }),
    prisma.class.count({
      where: { schoolId },
    }),
    prisma.exam.count({
      where: { schoolId, isActive: true },
    }),
  ])

  // Get attendance statistics for current month
  const currentDate = new Date()
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const attendanceStats = await prisma.attendance.groupBy({
    by: ['status'],
    where: {
      schoolId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _count: true,
  })

  const totalAttendanceRecords = attendanceStats.reduce((sum, stat) => sum + stat._count, 0)
  const presentRecords = attendanceStats.find(stat => stat.status === 'PRESENT')?._count || 0
  const attendancePercentage = totalAttendanceRecords > 0 ? Math.round((presentRecords / totalAttendanceRecords) * 100) : 0

  // Get pending fees
  const pendingFees = await prisma.fee.aggregate({
    where: {
      schoolId,
      status: 'PENDING',
      dueDate: {
        lt: new Date(),
      },
    },
    _sum: {
      amount: true,
    },
  })

  // Get upcoming exams (next 7 days)
  const upcomingExams = await prisma.exam.count({
    where: {
      schoolId,
      isActive: true,
      date: {
        gte: new Date(),
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    },
  })

  // Role-specific data
  let roleSpecificData = {}

  if (user?.role === 'ADMIN') {
    // Admin specific stats
    const [recentUsers, recentActivities] = await Promise.all([
      prisma.user.findMany({
        where: { schoolId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.notification.findMany({
        where: { schoolId },
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    roleSpecificData = {
      recentUsers,
      recentActivities,
    }
  } else if (user?.role === 'TEACHER') {
    // Teacher specific stats
    const teacher = await prisma.teacher.findFirst({
      where: { userId: user.id },
    })

    if (teacher) {
      const [myClasses, myStudents] = await Promise.all([
        prisma.class.findMany({
          where: { schoolId },
          select: {
            id: true,
            name: true,
            section: true,
          },
        }),
        prisma.student.count({
          where: {
            schoolId,
            class: { in: teacher.subjects },
          },
        }),
      ])

      roleSpecificData = {
        myClasses,
        myStudents,
      }
    }
  } else if (user?.role === 'STUDENT') {
    // Student specific stats
    const student = await prisma.student.findFirst({
      where: { userId: user.id },
    })

    if (student) {
      const [myAttendance, myResults, myFees] = await Promise.all([
        prisma.attendance.findMany({
          where: {
            studentId: student.id,
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          select: {
            date: true,
            status: true,
          },
          orderBy: { date: 'desc' },
          take: 10,
        }),
        prisma.result.findMany({
          where: { studentId: student.id },
          select: {
            subject: true,
            marksObtained: true,
            totalMarks: true,
            grade: true,
            exam: {
              select: {
                name: true,
                date: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        prisma.fee.findMany({
          where: { studentId: student.id },
          select: {
            type: true,
            amount: true,
            dueDate: true,
            status: true,
          },
          orderBy: { dueDate: 'desc' },
          take: 5,
        }),
      ])

      roleSpecificData = {
        myAttendance,
        myResults,
        myFees,
        studentInfo: {
          name: student.name,
          rollNumber: student.rollNumber,
          class: student.class,
          section: student.section,
        },
      }
    }
  } else if (user?.role === 'PARENT') {
    // Parent specific stats
    const parent = await prisma.parent.findFirst({
      where: { userId: user.id },
    })

    if (parent) {
      const children = await prisma.student.findMany({
        where: { parentId: parent.id },
        select: {
          id: true,
          name: true,
          rollNumber: true,
          class: true,
          section: true,
        },
      })

      const childrenIds = children.map(child => child.id)

      const [childrenAttendance, childrenResults, childrenFees] = await Promise.all([
        prisma.attendance.findMany({
          where: {
            studentId: { in: childrenIds },
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          select: {
            studentId: true,
            date: true,
            status: true,
            student: {
              select: {
                name: true,
                class: true,
                section: true,
              },
            },
          },
          orderBy: { date: 'desc' },
          take: 20,
        }),
        prisma.result.findMany({
          where: { studentId: { in: childrenIds } },
          select: {
            studentId: true,
            subject: true,
            marksObtained: true,
            totalMarks: true,
            grade: true,
            exam: {
              select: {
                name: true,
                date: true,
              },
            },
            student: {
              select: {
                name: true,
                class: true,
                section: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
        prisma.fee.findMany({
          where: { studentId: { in: childrenIds } },
          select: {
            studentId: true,
            type: true,
            amount: true,
            dueDate: true,
            status: true,
            student: {
              select: {
                name: true,
                class: true,
                section: true,
              },
            },
          },
          orderBy: { dueDate: 'desc' },
          take: 10,
        }),
      ])

      roleSpecificData = {
        children,
        childrenAttendance,
        childrenResults,
        childrenFees,
      }
    }
  }

  res.json({
    success: true,
    data: {
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalExams,
        attendancePercentage,
        pendingFeesAmount: pendingFees._sum.amount || 0,
        upcomingExams,
      },
      ...roleSpecificData,
    },
  })
}))

export default router
