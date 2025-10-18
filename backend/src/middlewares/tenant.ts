import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from './auth'
import { prisma } from '../server'

export interface TenantRequest extends AuthRequest {
  schoolId?: string
  school?: any
}

export const tenantMiddleware = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract school ID from various sources
    let schoolId: string | undefined

    // 1. From X-School-ID header
    schoolId = req.headers['x-school-id'] as string

    // 2. From subdomain (schoolname.yourapp.com)
    if (!schoolId) {
      const host = req.get('host') || ''
      const subdomain = host.split('.')[0]
      
      if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
        const school = await prisma.school.findUnique({
          where: { domain: host },
          select: { id: true },
        })
        
        if (school) {
          schoolId = school.id
        }
      }
    }

    // 3. From user context (if authenticated)
    if (!schoolId && req.user?.schoolId) {
      schoolId = req.user.schoolId
    }

    // 4. From query parameter (for development/testing)
    if (!schoolId) {
      schoolId = req.query.schoolId as string
    }

    if (!schoolId) {
      return res.status(400).json({
        success: false,
        message: 'School context required',
      })
    }

    // Verify school exists and is active
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        id: true,
        name: true,
        isActive: true,
        domain: true,
        theme: true,
      },
    })

    if (!school || !school.isActive) {
      return res.status(404).json({
        success: false,
        message: 'School not found or inactive',
      })
    }

    req.schoolId = schoolId
    req.school = school
    next()
  } catch (error) {
    console.error('Tenant middleware error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export const optionalTenantMiddleware = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Similar to tenantMiddleware but doesn't require schoolId
    let schoolId: string | undefined

    schoolId = req.headers['x-school-id'] as string

    if (!schoolId) {
      const host = req.get('host') || ''
      const school = await prisma.school.findUnique({
        where: { domain: host },
        select: { id: true },
      })
      
      if (school) {
        schoolId = school.id
      }
    }

    if (!schoolId && req.user?.schoolId) {
      schoolId = req.user.schoolId
    }

    if (schoolId) {
      const school = await prisma.school.findUnique({
        where: { id: schoolId },
        select: {
          id: true,
          name: true,
          isActive: true,
          domain: true,
          theme: true,
        },
      })

      if (school && school.isActive) {
        req.schoolId = schoolId
        req.school = school
      }
    }

    next()
  } catch (error) {
    console.error('Optional tenant middleware error:', error)
    // Don't fail the request, just continue without tenant context
    next()
  }
}
