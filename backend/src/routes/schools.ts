import express from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../server'
import { asyncHandler, createError } from '../middlewares/errorHandler'
import { AuthRequest } from '../middlewares/auth'

const router = express.Router()

// School validation rules
const schoolValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('स्कूल का नाम 2-100 अक्षरों का होना चाहिए'),
  body('domain').isURL({ protocols: ['http', 'https'], require_protocol: false }).withMessage('वैध डोमेन दर्ज करें'),
  body('address').trim().isLength({ min: 10, max: 500 }).withMessage('पता 10-500 अक्षरों का होना चाहिए'),
  body('phone').isMobilePhone('any').withMessage('वैध फोन नंबर दर्ज करें'),
  body('email').isEmail().normalizeEmail().withMessage('वैध ईमेल दर्ज करें'),
  body('principalName').trim().isLength({ min: 2, max: 50 }).withMessage('प्रिंसिपल का नाम 2-50 अक्षरों का होना चाहिए'),
]

// @route   GET /api/schools
// @desc    Get all schools
// @access  Public
router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 10, search } = req.query

  const where = {
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search as string, mode: 'insensitive' as const } },
        { domain: { contains: search as string, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [schools, total] = await Promise.all([
    prisma.school.findMany({
      where,
      select: {
        id: true,
        name: true,
        domain: true,
        logoUrl: true,
        address: true,
        phone: true,
        email: true,
        principalName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.school.count({ where }),
  ])

  res.json({
    success: true,
    data: schools,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  })
}))

// @route   GET /api/schools/:id
// @desc    Get school by ID
// @access  Public
router.get('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params

  const school = await prisma.school.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      theme: true,
      domain: true,
      address: true,
      phone: true,
      email: true,
      principalName: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!school) {
    throw createError('School not found', 404)
  }

  res.json({
    success: true,
    data: school,
  })
}))

// @route   POST /api/schools
// @desc    Create a new school
// @access  Public (in real app, this might be admin-only)
router.post('/', schoolValidation, asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    })
  }

  const { name, domain, address, phone, email, principalName, theme } = req.body

  // Check if domain already exists
  const existingSchool = await prisma.school.findUnique({
    where: { domain },
  })

  if (existingSchool) {
    throw createError('School with this domain already exists', 409)
  }

  // Create school
  const school = await prisma.school.create({
    data: {
      name,
      domain,
      address,
      phone,
      email,
      principalName,
      theme: theme || {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        accentColor: '#06b6d4',
        fontFamily: 'Inter',
      },
    },
    select: {
      id: true,
      name: true,
      domain: true,
      logoUrl: true,
      theme: true,
      address: true,
      phone: true,
      email: true,
      principalName: true,
      isActive: true,
      createdAt: true,
    },
  })

  res.status(201).json({
    success: true,
    message: 'School created successfully',
    data: school,
  })
}))

// @route   PUT /api/schools/:id
// @desc    Update school
// @access  Private (Admin only)
router.put('/:id', schoolValidation, asyncHandler(async (req: AuthRequest, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    })
  }

  const { id } = req.params
  const { name, domain, address, phone, email, principalName, theme, logoUrl } = req.body

  // Check if school exists
  const existingSchool = await prisma.school.findUnique({
    where: { id },
  })

  if (!existingSchool) {
    throw createError('School not found', 404)
  }

  // Check if domain is being changed and if new domain already exists
  if (domain !== existingSchool.domain) {
    const domainExists = await prisma.school.findUnique({
      where: { domain },
    })

    if (domainExists) {
      throw createError('School with this domain already exists', 409)
    }
  }

  // Update school
  const school = await prisma.school.update({
    where: { id },
    data: {
      name,
      domain,
      address,
      phone,
      email,
      principalName,
      theme,
      logoUrl,
    },
    select: {
      id: true,
      name: true,
      domain: true,
      logoUrl: true,
      theme: true,
      address: true,
      phone: true,
      email: true,
      principalName: true,
      isActive: true,
      updatedAt: true,
    },
  })

  res.json({
    success: true,
    message: 'School updated successfully',
    data: school,
  })
}))

// @route   DELETE /api/schools/:id
// @desc    Delete school (soft delete)
// @access  Private (Admin only)
router.delete('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params

  // Check if school exists
  const school = await prisma.school.findUnique({
    where: { id },
  })

  if (!school) {
    throw createError('School not found', 404)
  }

  // Soft delete by setting isActive to false
  await prisma.school.update({
    where: { id },
    data: { isActive: false },
  })

  res.json({
    success: true,
    message: 'School deleted successfully',
  })
}))

// @route   GET /api/schools/:id/stats
// @desc    Get school statistics
// @access  Public
router.get('/:id/stats', asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params

  const school = await prisma.school.findUnique({
    where: { id },
  })

  if (!school) {
    throw createError('School not found', 404)
  }

  const [
    totalStudents,
    totalTeachers,
    totalParents,
    activeUsers,
  ] = await Promise.all([
    prisma.student.count({
      where: { schoolId: id, isActive: true },
    }),
    prisma.teacher.count({
      where: { schoolId: id, isActive: true },
    }),
    prisma.parent.count({
      where: { schoolId: id, isActive: true },
    }),
    prisma.user.count({
      where: { schoolId: id, isActive: true },
    }),
  ])

  res.json({
    success: true,
    data: {
      totalStudents,
      totalTeachers,
      totalParents,
      activeUsers,
      schoolName: school.name,
    },
  })
}))

export default router
