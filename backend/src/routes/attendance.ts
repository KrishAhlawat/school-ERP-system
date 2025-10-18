import express, { Response } from 'express'
import { prisma } from '../server'
import { asyncHandler } from '../middlewares/errorHandler'
import { AuthRequest } from '../middlewares/auth'
import { TenantRequest } from '../middlewares/tenant'

const router = express.Router()

// @route   GET /api/attendance
// @desc    Get attendance records
// @access  Private
router.get('/', asyncHandler(async (req: AuthRequest & TenantRequest, res: Response) => {
  const { schoolId } = req
  const { page = 1, limit = 10, date, class: className, section } = req.query

  if (!schoolId) {
    throw new Error('School context required')
  }

  const where = {
    schoolId,
    ...(date && { date: new Date(date as string) }),
    ...(className && section && {
      student: {
        class: className as string,
        section: section as string,
      },
    }),
  }

  const [attendance, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      select: {
        id: true,
        date: true,
        status: true,
        remarks: true,
        createdAt: true,
        student: {
          select: {
            id: true,
            name: true,
            rollNumber: true,
            class: true,
            section: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.attendance.count({ where }),
  ])

  res.json({
    success: true,
    data: attendance,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  })
}))

export default router
