'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Award, Calendar, TrendingUp, DollarSign } from 'lucide-react'

export default function ParentDashboard() {
  const { data: session } = useSession()

  const children = [
    {
      name: 'Rahul Singh',
      class: '10A',
      rollNumber: 'S001',
      attendance: 95,
      lastExamGrade: 'A+',
    },
    {
      name: 'Priya Singh',
      class: '8B',
      rollNumber: 'S002',
      attendance: 88,
      lastExamGrade: 'A',
    },
  ]

  const stats = [
    {
      title: 'Number of Children',
      value: children.length.toString(),
      change: 'In School',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Average Attendance',
      value: '91.5%',
      change: 'This Month',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Outstanding Fees',
      value: '₹8,500',
      change: '2 Payments',
      icon: DollarSign,
      color: 'text-orange-600',
    },
    {
      title: 'Upcoming Events',
      value: '3',
      change: 'This Week',
      icon: Calendar,
      color: 'text-purple-600',
    },
  ]

  const recentActivities = [
    {
      child: 'Rahul Singh',
      activity: 'Achieved A+ grade in Mathematics exam',
      time: '2 hours ago',
      type: 'achievement',
    },
    {
      child: 'Priya Singh',
      activity: 'Submitted Hindi assignment',
      time: '1 day ago',
      type: 'assignment',
    },
    {
      child: 'Rahul Singh',
      activity: 'Attended today\'s class',
      time: '2 days ago',
      type: 'attendance',
    },
    {
      child: 'Priya Singh',
      activity: 'Participated in Sports Day',
      time: '3 days ago',
      type: 'event',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Parent Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome, {session?.user?.name}! View your children's progress here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Children Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Children
            </CardTitle>
            <CardDescription>
              General information about your children
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {children.map((child, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-lg">{child.name}</h4>
                      <p className="text-sm text-gray-500">
                        Class {child.class} • Roll Number: {child.rollNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        child.attendance >= 90 ? 'text-green-600' :
                        child.attendance >= 80 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {child.attendance}%
                      </div>
                      <div className="text-xs text-gray-500">Attendance</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Last Grade: {child.lastExamGrade}</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Recent activities of your children
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'achievement' ? 'bg-green-500' :
                    activity.type === 'assignment' ? 'bg-blue-500' :
                    activity.type === 'attendance' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.child}</p>
                    <p className="text-sm text-gray-600">{activity.activity}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>
            Information about upcoming school events and important dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Parent-Teacher Meeting</span>
              </div>
              <p className="text-sm text-gray-600">January 25, 2024</p>
              <p className="text-xs text-gray-500">10:00 AM - 12:00 PM</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-green-500" />
                <span className="font-medium">Mid Term Exam</span>
              </div>
              <p className="text-sm text-gray-600">February 1-15, 2024</p>
              <p className="text-xs text-gray-500">All Classes</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Fee Payment</span>
              </div>
              <p className="text-sm text-gray-600">February 5, 2024</p>
              <p className="text-xs text-gray-500">Last Date</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
