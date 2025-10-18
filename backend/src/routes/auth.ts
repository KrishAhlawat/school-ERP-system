import express, { Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { prisma } from '../server'
import { asyncHandler, createError } from '../middlewares/errorHandler'
import { AuthRequest } from '../middlewares/auth'
import { UserRole } from '../../../shared'

const router = express.Router()

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  )
  
  const refreshToken = jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}

// Register validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(Object.values(UserRole)).withMessage('Please select a valid role'),
  body('schoolId').optional().isString().withMessage('Please enter a valid school ID'),
]

// Login validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  body('schoolDomain').optional().isString().withMessage('Please enter a valid school domain'),
]

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    })
  }

  const { name, email, password, role, schoolId } = req.body

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw createError('User already exists with this email', 409)
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      schoolId: schoolId || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      schoolId: true,
      createdAt: true,
    },
  })

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id)

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token: accessToken,
      refreshToken,
    },
  })
}))

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    })
  }

  const { email, password, schoolDomain } = req.body

  // Find user with school context
  let user
  if (schoolDomain) {
    // Find school first
    const school = await prisma.school.findUnique({
      where: { domain: schoolDomain },
    })

    if (!school) {
      throw createError('School not found', 404)
    }

    user = await prisma.user.findUnique({
      where: { 
        email,
        schoolId: school.id,
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
      },
    })
  } else {
    user = await prisma.user.findUnique({
      where: { email },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
      },
    })
  }

  if (!user) {
    throw createError('Invalid credentials', 401)
  }

  if (!user.password) {
    throw createError('Please use social login', 401)
  }

  if (!user.isActive) {
    throw createError('Account is deactivated', 401)
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw createError('Invalid credentials', 401)
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id)

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      token: accessToken,
      refreshToken,
    },
  })
}))

// @route   POST /api/auth/google
// @desc    Google OAuth login/register
// @access  Public
router.post('/google', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, name, googleId } = req.body

  if (!email || !name || !googleId) {
    throw createError('Missing required fields', 400)
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email },
    include: {
      school: {
        select: {
          id: true,
          name: true,
          domain: true,
        },
      },
    },
  })

  if (!user) {
    // Create new user with default school (you might want to handle this differently)
    const defaultSchool = await prisma.school.findFirst({
      where: { isActive: true },
    })

    if (!defaultSchool) {
      throw createError('No active school found', 404)
    }

    user = await prisma.user.create({
      data: {
        name,
        email,
        role: UserRole.STUDENT, // Default role
        schoolId: defaultSchool.id,
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
      },
    })
  }

  // Create or update account record
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        providerAccountId: googleId,
      },
    },
    update: {
      userId: user.id,
    },
    create: {
      userId: user.id,
      type: 'oauth',
      provider: 'google',
      providerAccountId: googleId,
    },
  })

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id)

  res.json({
    success: true,
    message: 'Google authentication successful',
    data: {
      user,
      token: accessToken,
      refreshToken,
    },
  })
}))

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    throw createError('Refresh token required', 400)
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any

    if (decoded.type !== 'refresh') {
      throw createError('Invalid refresh token', 401)
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      throw createError('User not found or inactive', 401)
    }

    // Generate new tokens
    const tokens = generateTokens(user.id)

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
    })
  } catch (error) {
    throw createError('Invalid refresh token', 401)
  }
}))

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw createError('Authentication required', 401)
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      schoolId: true,
      profileImage: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      school: {
        select: {
          id: true,
          name: true,
          domain: true,
          logoUrl: true,
          theme: true,
        },
      },
    },
  })

  if (!user) {
    throw createError('User not found', 404)
  }

  res.json({
    success: true,
    data: user,
  })
}))

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate tokens)
// @access  Private
router.post('/logout', asyncHandler(async (req: AuthRequest, res: Response) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just return success
  res.json({
    success: true,
    message: 'Logout successful',
  })
}))

export default router
