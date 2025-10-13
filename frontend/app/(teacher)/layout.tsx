import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'TEACHER') {
    redirect('/unauthorized')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              शिक्षक पैनल
            </h2>
          </div>
          <nav className="mt-6">
            <div className="px-3 space-y-1">
              <a
                href="/teacher/dashboard"
                className="block px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-md"
              >
                डैशबोर्ड
              </a>
              <a
                href="/teacher/classes"
                className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                मेरी कक्षाएं
              </a>
              <a
                href="/teacher/attendance"
                className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                उपस्थिति
              </a>
              <a
                href="/teacher/exams"
                className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                परीक्षाएं
              </a>
              <a
                href="/teacher/grading"
                className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                ग्रेडिंग
              </a>
              <a
                href="/teacher/assignments"
                className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                असाइनमेंट
              </a>
              <a
                href="/teacher/reports"
                className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                रिपोर्ट्स
              </a>
              <a
                href="/teacher/profile"
                className="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                प्रोफाइल
              </a>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Navigation */}
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  School ERP System
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {session.user.name}
                </span>
                <a
                  href="/api/auth/signout"
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  लॉगआउट
                </a>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}
