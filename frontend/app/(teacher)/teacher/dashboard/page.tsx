'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Calendar, Award, Clock, TrendingUp } from 'lucide-react'

export default function TeacherDashboard() {
  const { data: session } = useSession()

  const stats = [
    {
      title: 'मेरी कक्षाएं',
      value: '3',
      change: 'सक्रिय',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'कुल छात्र',
      value: '120',
      change: 'सभी कक्षाओं में',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'आज की कक्षाएं',
      value: '4',
      change: 'शेड्यूल्ड',
      icon: Calendar,
      color: 'text-orange-600',
    },
    {
      title: 'असाइनमेंट पेंडिंग',
      value: '15',
      change: 'ग्रेडिंग के लिए',
      icon: Award,
      color: 'text-purple-600',
    },
  ]

  const todaySchedule = [
    {
      time: '09:00 AM',
      subject: 'गणित',
      class: '10A',
      duration: '45 मिनट',
      status: 'completed',
    },
    {
      time: '10:00 AM',
      subject: 'गणित',
      class: '10B',
      duration: '45 मिनट',
      status: 'in-progress',
    },
    {
      time: '11:00 AM',
      subject: 'भौतिकी',
      class: '11A',
      duration: '45 मिनट',
      status: 'upcoming',
    },
    {
      time: '02:00 PM',
      subject: 'गणित',
      class: '9A',
      duration: '45 मिनट',
      status: 'upcoming',
    },
  ]

  const recentAttendance = [
    {
      class: '10A',
      subject: 'गणित',
      date: '2024-01-22',
      present: 28,
      absent: 2,
      percentage: 93.3,
    },
    {
      class: '10B',
      subject: 'गणित',
      date: '2024-01-22',
      present: 30,
      absent: 0,
      percentage: 100,
    },
    {
      class: '11A',
      subject: 'भौतिकी',
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
          शिक्षक डैशबोर्ड
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          स्वागत है, {session?.user?.name}! आज का शेड्यूल यहां देखें।
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
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              आज का शेड्यूल
            </CardTitle>
            <CardDescription>
              आज की कक्षाओं की सूची
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
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{schedule.time}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {schedule.status === 'completed' ? 'पूर्ण' :
                           schedule.status === 'in-progress' ? 'चल रहा' :
                           'आगामी'}
                        </span>
                      </div>
                      <h4 className="font-medium mt-1">{schedule.subject}</h4>
                      <p className="text-sm text-gray-500">कक्षा {schedule.class}</p>
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
              <TrendingUp className="h-5 w-5" />
              हाल की उपस्थिति
            </CardTitle>
            <CardDescription>
              आपकी कक्षाओं की उपस्थिति दर
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
                    <span>उपस्थित: {attendance.present}</span>
                    <span>अनुपस्थित: {attendance.absent}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
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
          <CardTitle>त्वरित कार्य</CardTitle>
          <CardDescription>
            सामान्य कार्यों के लिए शॉर्टकट
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium">उपस्थिति</div>
              <div className="text-sm text-gray-500">आज की उपस्थिति</div>
            </button>
            <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium">असाइनमेंट</div>
              <div className="text-sm text-gray-500">नया असाइनमेंट</div>
            </button>
            <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium">ग्रेडिंग</div>
              <div className="text-sm text-gray-500">अंक दर्ज करें</div>
            </button>
            <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium">रिपोर्ट</div>
              <div className="text-sm text-gray-500">कक्षा रिपोर्ट</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
