import { UserRole } from '@school-erp/shared'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: UserRole
      schoolId: string
    }
    accessToken: string
    refreshToken: string
  }

  interface User {
    role: UserRole
    schoolId: string
    accessToken: string
    refreshToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    schoolId: string
    accessToken: string
    refreshToken: string
  }
}
