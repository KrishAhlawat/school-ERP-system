'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Award, Calendar, TrendingUp, DollarSign } from 'lucide-react'

export default function ParentDashboard() {
  const { data: session } = useSession()

  const children = [
    {
      name: 'राहुल सिंह',
      class: '10A',
      rollNumber: 'S001',
      attendance: 95,
      lastExamGrade: 'A+',
    },
    {
      name: 'प्रिया सिंह',
      class: '8B',
      rollNumber: 'S002',
      attendance: 88,
      lastExamGrade: 'A',
    },
  ]

  const stats = [
    {
      title: 'बच्चों की संख्या',
      value: children.length.toString(),
      change: 'स्कूल में',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'औसत उपस्थिति',
      value: '91.5%',
      change: 'इस महीने',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'बकाया शुल्क',
      value: '₹8,500',
      change: '2 भुगतान',
      icon: DollarSign,
      color: 'text-orange-600',
    },
    {
      title: 'आगामी घटनाएं',
      value: '3',
      change: 'इस सप्ताह',
      icon: Calendar,
      color: 'text-purple-600',
    },
  ]

  const recentActivities = [
    {
      child: 'राहुल सिंह',
      activity: 'गणित परीक्षा में A+ ग्रेड प्राप्त किया',
      time: '2 घंटे पहले',
      type: 'achievement',
    },
    {
      child: 'प्रिया सिंह',
      activity: 'हिंदी असाइनमेंट जमा किया',
      time: '1 दिन पहले',
      type: 'assignment',
    },
    {
      child: 'राहुल सिंह',
      activity: 'आज की कक्षा में उपस्थित रहे',
      time: '2 दिन पहले',
      type: 'attendance',
    },
    {
      child: 'प्रिया सिंह',
      activity: 'स्पोर्ट्स डे में भाग लिया',
      time: '3 दिन पहले',
      type: 'event',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          अभिभावक डैशबोर्ड
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          स्वागत है, {session?.user?.name}! आपके बच्चों की प्रगति यहां देखें।
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
              मेरे बच्चे
            </CardTitle>
            <CardDescription>
              आपके बच्चों की सामान्य जानकारी
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
                        कक्षा {child.class} • रोल नंबर: {child.rollNumber}
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
                      <div className="text-xs text-gray-500">उपस्थिति</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">अंतिम ग्रेड: {child.lastExamGrade}</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      विस्तार देखें →
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
              हाल की गतिविधियां
            </CardTitle>
            <CardDescription>
              आपके बच्चों की हाल की गतिविधियां
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
          <CardTitle>आगामी घटनाएं</CardTitle>
          <CardDescription>
            स्कूल की आगामी घटनाओं और महत्वपूर्ण तिथियों की जानकारी
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">पैरेंट-टीचर मीटिंग</span>
              </div>
              <p className="text-sm text-gray-600">25 जनवरी, 2024</p>
              <p className="text-xs text-gray-500">10:00 AM - 12:00 PM</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-green-500" />
                <span className="font-medium">मिड टर्म एग्जाम</span>
              </div>
              <p className="text-sm text-gray-600">1-15 फरवरी, 2024</p>
              <p className="text-xs text-gray-500">सभी कक्षाएं</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <span className="font-medium">फीस भुगतान</span>
              </div>
              <p className="text-sm text-gray-600">5 फरवरी, 2024</p>
              <p className="text-xs text-gray-500">अंतिम तिथि</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
