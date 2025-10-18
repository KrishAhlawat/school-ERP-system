'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Calendar, Award, Clock, TrendingUp } from 'lucide-react'

export default function TeacherDashboard() {
  const { data: session } = useSession()

  const stats = [
    {
      title: 'My Classes',
      value: '3',
      change: 'Active',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Total Students',
      value: '120',
      change: 'Across all classes',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: "Today's Classes",
      value: '4',
      change: 'Scheduled',
      icon: Calendar,
      color: 'text-orange-600',
    },
    {
      title: 'Pending Assignments',
      value: '15',
      change: 'For grading',
      icon: Award,
      color: 'text-purple-600',
    },
  ]

  const todaySchedule = [
    {
      time: '09:00 AM',
      subject: 'Mathematics',
      class: '10A',
      duration: '45 minutes',
      status: 'completed',
    },
    {
      time: '10:00 AM',
      subject: 'Mathematics',
      class: '10B',
      duration: '45 minutes',
      status: 'in-progress',
    },
    {
      time: '11:00 AM',
      subject: 'Physics',
      class: '11A',
      duration: '45 minutes',
      status: 'upcoming',
    },
    {
      time: '02:00 PM',
      subject: 'Mathematics',
      class: '9A',
      duration: '45 minutes',
      status: 'upcoming',
    },
  ]

  const recentAttendance = [
    {
      class: '10A',
      subject: 'Mathematics',
      date: '2024-01-22',
      present: 28,
      absent: 2,
      percentage: 93.3,
    },
    {
      class: '10B',
      subject: 'Mathematics',
      date: '2024-01-22',
      present: 30,
      absent: 0,
      percentage: 100,
    },
    {
      class: '11A',
      subject: 'Physics',
      date: '2024-01-21',
      present: 25,
      absent: 3,
      percentage: 89.3,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome, {session?.user?.name}! Here's your schedule for today.
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
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>
              List of today's classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((schedule, index) => (
                <div key={index} className={`p-3 border rounded-lg ${
                  schedule.status === 'completed' ? 'bg-green-50 border-green-200 dark:bg-green-900/20' :
                  schedule.status === 'in-progress' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' :
                  'bg-gray-50 border-gray-200 dark:bg-gray-900/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{schedule.time}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {schedule.status === 'completed' ? 'Completed' :
                           schedule.status === 'in-progress' ? 'Ongoing' :
                           'Upcoming'}
                        </span>
                      </div>
                      <h4 className="mt-1 font-medium">{schedule.subject}</h4>
                      <p className="text-sm text-gray-500">Class {schedule.class}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{schedule.duration}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Attendance
            </CardTitle>
            <CardDescription>
              Attendance rate for your classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAttendance.map((attendance, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{attendance.class}</h4>
                      <p className="text-sm text-gray-500">{attendance.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        attendance.percentage >= 90 ? 'text-green-600' :
                        attendance.percentage >= 80 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {attendance.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Present: {attendance.present}</span>
                    <span>Absent: {attendance.absent}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {attendance.date}
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
              <div className="font-medium">Attendance</div>
              <div className="text-sm text-gray-500">Today's Attendance</div>
            </button>
            <button className="p-3 text-left transition-colors border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="font-medium">Assignment</div>
              <div className="text-sm text-gray-500">New Assignment</div>
            </button>
            <button className="p-3 text-left transition-colors border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="font-medium">Grading</div>
              <div className="text-sm text-gray-500">Enter Marks</div>
            </button>
            <button className="p-3 text-left transition-colors border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="font-medium">Report</div>
              <div className="text-sm text-gray-500">Class Report</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
