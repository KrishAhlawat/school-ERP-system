import express from 'express'
import { prisma } from '../server'
import { asyncHandler } from '../middlewares/errorHandler'
import { AuthRequest } from '../middlewares/auth'
import { TenantRequest } from '../middlewares/tenant'

const router = express.Router()

// @route   GET /api/fees
// @desc    Get all fees for the school
// @access  Private
router.get('/', asyncHandler(async (req: AuthRequest & TenantRequest, res) => {
  const { schoolId } = req
  const { page = 1, limit = 10, status, type, studentId } = req.query

  if (!schoolId) {
    throw new Error('School context required')
  }

  const where = {
    schoolId,
    ...(status && { status: status as string }),
    ...(type && { type: type as string }),
    ...(studentId && { studentId: studentId as string }),
  }

  const [fees, total] = await Promise.all([
    prisma.fee.findMany({
      where,
      select: {
        id: true,
        type: true,
        amount: true,
        dueDate: true,
        paidDate: true,
        status: true,
        description: true,
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
      orderBy: { dueDate: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.fee.count({ where }),
  ])

  res.json({
    success: true,
    data: fees,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  })
}))

export default router
