import express from 'express'
import { prisma } from '../server'
import { asyncHandler } from '../middlewares/errorHandler'
import { AuthRequest } from '../middlewares/auth'
import { TenantRequest } from '../middlewares/tenant'

const router = express.Router()

// @route   GET /api/teachers
// @desc    Get all teachers for the school
// @access  Private
router.get('/', asyncHandler(async (req: AuthRequest & TenantRequest, res) => {
  const { schoolId } = req
  const { page = 1, limit = 10, search } = req.query

  if (!schoolId) {
    throw new Error('School context required')
  }

  const where = {
    schoolId,
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search as string, mode: 'insensitive' as const } },
        { employeeId: { contains: search as string, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      select: {
        id: true,
        name: true,
        employeeId: true,
        subjects: true,
        qualification: true,
        experience: true,
        phone: true,
        email: true,
        joiningDate: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { employeeId: 'asc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.teacher.count({ where }),
  ])

  res.json({
    success: true,
    data: teachers,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  })
}))

// @route   GET /api/teachers/:id
// @desc    Get teacher by ID
// @access  Private
router.get('/:id', asyncHandler(async (req: AuthRequest & TenantRequest, res) => {
  const { id } = req.params
  const { schoolId } = req

  if (!schoolId) {
    throw new Error('School context required')
  }

  const teacher = await prisma.teacher.findFirst({
    where: { id, schoolId, isActive: true },
    select: {
      id: true,
      name: true,
      employeeId: true,
      subjects: true,
      qualification: true,
      experience: true,
      phone: true,
      email: true,
      address: true,
      joiningDate: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profileImage: true,
        },
      },
    },
  })

  if (!teacher) {
    throw new Error('Teacher not found')
  }

  res.json({
    success: true,
    data: teacher,
  })
}))

export default router
