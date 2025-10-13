import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    // Redirect based on user role
    switch (session.user.role) {
      case 'ADMIN':
        redirect('/admin/dashboard')
      case 'TEACHER':
        redirect('/teacher/dashboard')
      case 'STUDENT':
        redirect('/student/dashboard')
      case 'PARENT':
        redirect('/parent/dashboard')
      default:
        redirect('/dashboard')
    }
  }

  redirect('/login')
}
