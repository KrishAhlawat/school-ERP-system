import express, { Response } from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../server'
import { asyncHandler, createError } from '../middlewares/errorHandler'
import { AuthRequest } from '../middlewares/auth'
import { TenantRequest } from '../middlewares/tenant'

const router = express.Router()

// Student validation rules
const studentValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  body('rollNumber').trim().isLength({ min: 1, max: 20 }).withMessage('Roll number is required'),
  body('class').trim().isLength({ min: 1, max: 20 }).withMessage('Class is required'),
  body('section').trim().isLength({ min: 1, max: 10 }).withMessage('Section is required'),
  body('parentId').isString().withMessage('Please enter a valid parent ID'),
  body('dateOfBirth').isISO8601().withMessage('Please enter a valid date of birth'),
  body('gender').isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Please select a valid gender'),
  body('address').trim().isLength({ min: 10, max: 500 }).withMessage('Address must be between 10-500 characters'),
]

// @route   GET /api/students
// @desc    Get all students for the school
// @access  Private
router.get('/', asyncHandler(async (req: AuthRequest & TenantRequest, res: Response) => {
  const { schoolId } = req
  const { page = 1, limit = 10, search, class: className, section } = req.query

  if (!schoolId) {
    throw createError('School context required', 400)
  }

  const where = {
    schoolId,
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search as string, mode: 'insensitive' as const } },
        { rollNumber: { contains: search as string, mode: 'insensitive' as const } },
      ],
    }),
    ...(className && { class: className as string }),
    ...(section && { section: section as string }),
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      select: {
        id: true,
        name: true,
        rollNumber: true,
        class: true,
        section: true,
        dateOfBirth: true,
        gender: true,
        phone: true,
        email: true,
        admissionDate: true,
        parent: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: { rollNumber: 'asc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.student.count({ where }),
  ])

  res.json({
    success: true,
    data: students,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  })
}))

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', asyncHandler(async (req: AuthRequest & TenantRequest, res: Response) => {
  const { id } = req.params
  const { schoolId } = req

  if (!schoolId) {
    throw createError('School context required', 400)
  }

  const student = await prisma.student.findFirst({
    where: { id, schoolId, isActive: true },
    select: {
      id: true,
      name: true,
      rollNumber: true,
      class: true,
      section: true,
      dateOfBirth: true,
      gender: true,
      address: true,
      phone: true,
      email: true,
      admissionDate: true,
      createdAt: true,
      updatedAt: true,
      parent: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          address: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  })

  if (!student) {
    throw createError('Student not found', 404)
  }

  res.json({
    success: true,
    data: student,
  })
}))

// @route   POST /api/students
// @desc    Create a new student
// @access  Private (Admin/Teacher)
router.post('/', studentValidation, asyncHandler(async (req: AuthRequest & TenantRequest, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    })
  }

  const { schoolId, user } = req

  if (!schoolId) {
    throw createError('School context required', 400)
  }

  // Check permissions
  if (user?.role !== 'ADMIN' && user?.role !== 'TEACHER') {
    throw createError('Insufficient permissions', 403)
  }

  const {
    name,
    rollNumber,
    class: className,
    section,
    parentId,
    dateOfBirth,
    gender,
    address,
    phone,
    email,
    admissionDate,
  } = req.body

  // Check if roll number already exists in the school
  const existingStudent = await prisma.student.findFirst({
    where: { rollNumber, schoolId },
  })

  if (existingStudent) {
    throw createError('Student with this roll number already exists', 409)
  }

  // Verify parent exists and belongs to the same school
  const parent = await prisma.parent.findFirst({
    where: { id: parentId, schoolId },
  })

  if (!parent) {
    throw createError('Parent not found', 404)
  }

  // Create student
  const student = await prisma.student.create({
    data: {
      name,
      rollNumber,
      class: className,
      section,
      parentId,
      schoolId,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      phone,
      email,
      admissionDate: new Date(admissionDate || new Date()),
    },
    select: {
      id: true,
      name: true,
      rollNumber: true,
      class: true,
      section: true,
      dateOfBirth: true,
      gender: true,
      phone: true,
      email: true,
      admissionDate: true,
      parent: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
    },
  })

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: student,
  })
}))

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Admin/Teacher)
router.put('/:id', studentValidation, asyncHandler(async (req: AuthRequest & TenantRequest, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    })
  }

  const { id } = req.params
  const { schoolId, user } = req

  if (!schoolId) {
    throw createError('School context required', 400)
  }

  // Check permissions
  if (user?.role !== 'ADMIN' && user?.role !== 'TEACHER') {
    throw createError('Insufficient permissions', 403)
  }

  // Check if student exists
  const existingStudent = await prisma.student.findFirst({
    where: { id, schoolId },
  })

  if (!existingStudent) {
    throw createError('Student not found', 404)
  }

  const {
    name,
    rollNumber,
    class: className,
    section,
    parentId,
    dateOfBirth,
    gender,
    address,
    phone,
    email,
    admissionDate,
  } = req.body

  // Check if roll number is being changed and if new roll number already exists
  if (rollNumber !== existingStudent.rollNumber) {
    const rollNumberExists = await prisma.student.findFirst({
      where: { rollNumber, schoolId, id: { not: id } },
    })

    if (rollNumberExists) {
      throw createError('Student with this roll number already exists', 409)
    }
  }

  // Verify parent exists and belongs to the same school
  if (parentId !== existingStudent.parentId) {
    const parent = await prisma.parent.findFirst({
      where: { id: parentId, schoolId },
    })

    if (!parent) {
      throw createError('Parent not found', 404)
    }
  }

  // Update student
  const student = await prisma.student.update({
    where: { id },
    data: {
      name,
      rollNumber,
      class: className,
      section,
      parentId,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      phone,
      email,
      admissionDate: new Date(admissionDate),
    },
    select: {
      id: true,
      name: true,
      rollNumber: true,
      class: true,
      section: true,
      dateOfBirth: true,
      gender: true,
      phone: true,
      email: true,
      admissionDate: true,
      parent: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
    },
  })

  res.json({
    success: true,
    message: 'Student updated successfully',
    data: student,
  })
}))

// @route   DELETE /api/students/:id
// @desc    Delete student (soft delete)
// @access  Private (Admin only)
router.delete('/:id', asyncHandler(async (req: AuthRequest & TenantRequest, res: Response) => {
  const { id } = req.params
  const { schoolId, user } = req

  if (!schoolId) {
    throw createError('School context required', 400)
  }

  // Check permissions
  if (user?.role !== 'ADMIN') {
    throw createError('Insufficient permissions', 403)
  }

  // Check if student exists
  const student = await prisma.student.findFirst({
    where: { id, schoolId },
  })

  if (!student) {
    throw createError('Student not found', 404)
  }

  // Soft delete
  await prisma.student.update({
    where: { id },
    data: { isActive: false },
  })

  res.json({
    success: true,
    message: 'Student deleted successfully',
  })
}))

export default router
