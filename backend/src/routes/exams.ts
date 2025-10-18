import express, { Response } from 'express'
import { prisma } from '../server'
import { asyncHandler } from '../middlewares/errorHandler'
import { AuthRequest } from '../middlewares/auth'
import { TenantRequest } from '../middlewares/tenant'
import { ExamType } from '@prisma/client'

const router = express.Router()

// @route   GET /api/exams
// @desc    Get all exams for the school
// @access  Private
router.get('/', asyncHandler(async (req: AuthRequest & TenantRequest, res: Response) => {
  const { schoolId } = req
  const { page = 1, limit = 10, search, type, class: className } = req.query

  if (!schoolId) {
    throw new Error('School context required')
  }

  const where: any = {
    schoolId,
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search as string, mode: 'insensitive' as const } },
        { subject: { contains: search as string, mode: 'insensitive' as const } },
      ],
    }),
    ...(type && Object.values(ExamType).includes(type as ExamType) && { type: type as ExamType }),
    ...(className && { class: className as string }),
  }

  const [exams, total] = await Promise.all([
    prisma.exam.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        subject: true,
        class: true,
        section: true,
        date: true,
        duration: true,
        totalMarks: true,
        passingMarks: true,
        createdAt: true,
      },
      orderBy: { date: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.exam.count({ where }),
  ])

  res.json({
    success: true,
    data: exams,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  })
}))

export default router
