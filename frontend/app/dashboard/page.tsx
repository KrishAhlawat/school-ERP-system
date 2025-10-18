'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      redirect('/login')
      return
    }

    // Redirect based on user role
    switch (session.user.role) {
      case 'ADMIN':
        redirect('/admin/dashboard')
        break
      case 'TEACHER':
        redirect('/teacher/dashboard')
        break
      case 'STUDENT':
        redirect('/student/dashboard')
        break
      case 'PARENT':
        redirect('/parent/dashboard')
        break
      default:
        redirect('/login')
    }
  }, [session, status])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

