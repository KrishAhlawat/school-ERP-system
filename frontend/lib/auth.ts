import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { UserRole } from '@school-erp/shared'

// Import Prisma client from backend
// For now, we'll use a mock implementation
// In production, you might want to share the Prisma client or use a different approach
const prisma = {
  user: {
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
  },
  account: {
    upsert: () => Promise.resolve({}),
  },
  session: {
    findFirst: () => Promise.resolve(null),
  },
  $connect: () => Promise.resolve(),
  $disconnect: () => Promise.resolve(),
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        schoolDomain: { label: 'School Domain', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              schoolDomain: credentials.schoolDomain,
            }),
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()
          
          if (data.success && data.data) {
            return {
              id: data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.name,
              role: data.data.user.role,
              schoolId: data.data.user.schoolId,
              accessToken: data.data.token,
              refreshToken: data.data.refreshToken,
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.schoolId = user.schoolId
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      // Refresh token logic
      if (account?.provider === 'google') {
        // Handle Google OAuth
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: token.email,
              name: token.name,
              googleId: account.providerAccountId,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data) {
              token.role = data.data.user.role
              token.schoolId = data.data.user.schoolId
              token.accessToken = data.data.token
              token.refreshToken = data.data.refreshToken
            }
          }
        } catch (error) {
          console.error('Google auth error:', error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.schoolId = token.schoolId as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}
