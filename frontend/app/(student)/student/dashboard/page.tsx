'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Calendar, Award, DollarSign, TrendingUp, Clock } from 'lucide-react'

export default function StudentDashboard() {
  const { data: session } = useSession()

  const stats = [
    {
      title: 'My Attendance',
      value: '95%',
      change: '+2%',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Total Subjects',
      value: '6',
      change: 'Active',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Upcoming Exams',
      value: '3',
      change: 'This week',
      icon: Calendar,
      color: 'text-orange-600',
    },
    {
      title: 'Latest Grade',
      value: 'A+',
      change: 'Mathematics',
      icon: Award,
      color: 'text-purple-600',
    },
  ]

  const upcomingExams = [
    {
      subject: 'Mathematics',
      date: '2024-01-25',
      time: '10:00 AM',
      duration: '3 hours',
      type: 'Mid Term',
    },
    {
      subject: 'Hindi',
      date: '2024-01-28',
      time: '11:00 AM',
      duration: '2 hours',
      type: 'Unit Test',
    },
    {
      subject: 'English',
      date: '2024-01-30',
      time: '09:00 AM',
      duration: '2 hours',
      type: 'Assignment',
    },
  ]

  const recentResults = [
    {
      subject: 'Mathematics',
      marks: '85/100',
      grade: 'A+',
      exam: 'Mid Term',
      date: '2024-01-15',
    },
    {
      subject: 'Hindi',
      marks: '78/100',
      grade: 'A',
      exam: 'Unit Test',
      date: '2024-01-10',
    },
    {
      subject: 'English',
      marks: '92/100',
      grade: 'A+',
      exam: 'Assignment',
      date: '2024-01-08',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Student Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome, {session?.user?.name}! Check your progress here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Exams
            </CardTitle>
            <CardDescription>
              Information about next exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExams.map((exam, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{exam.subject}</h4>
                    <p className="text-sm text-gray-500">{exam.type}</p>
                    <p className="text-xs text-gray-400">
                      {exam.date} • {exam.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      {exam.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recent Results
            </CardTitle>
            <CardDescription>
              Your recent exam results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{result.subject}</h4>
                    <p className="text-sm text-gray-500">{result.exam}</p>
                    <p className="text-xs text-gray-400">{result.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{result.marks}</div>
                    <div className={`text-sm font-medium ${
                      result.grade === 'A+' ? 'text-green-600' :
                      result.grade === 'A' ? 'text-blue-600' :
                      result.grade === 'B+' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {result.grade}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Shortcuts for common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <button className="p-3 text-left transition-colors border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="font-medium">Timetable</div>
              <div className="text-sm text-gray-500">Class Schedule</div>
            </button>
            <button className="p-3 text-left transition-colors border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="font-medium">Assignments</div>
              <div className="text-sm text-gray-500">Homework</div>
            </button>
            <button className="p-3 text-left transition-colors border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="font-medium">Library</div>
              <div className="text-sm text-gray-500">Books</div>
            </button>
            <button className="p-3 text-left transition-colors border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="font-medium">Fees</div>
              <div className="text-sm text-gray-500">Payment</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
