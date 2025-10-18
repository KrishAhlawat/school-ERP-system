import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserRole } from '@school-erp/shared'
import type { UserRole as PrismaUserRole } from '@prisma/client'
import { prisma } from '../server'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    // use Prisma-generated enum type to match DB user records
    role: PrismaUserRole
    schoolId: string
  }
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Get user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        schoolId: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive user',
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      })
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      })
    }

    console.error('Auth middleware error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    // Compare by string value to avoid enum type mismatch between prisma and shared package
    const roleValue = String(req.user.role) as unknown as UserRole
    if (!roles.includes(roleValue)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      })
    }

    next()
  }
}

export const requireAdmin = requireRole(UserRole.ADMIN)
export const requireTeacherOrAdmin = requireRole(UserRole.TEACHER, UserRole.ADMIN)
export const requireStudentOrParent = requireRole(UserRole.STUDENT, UserRole.PARENT)
