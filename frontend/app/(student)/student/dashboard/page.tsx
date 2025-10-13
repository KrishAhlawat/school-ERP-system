'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Calendar, Award, DollarSign, TrendingUp, Clock } from 'lucide-react'

export default function StudentDashboard() {
  const { data: session } = useSession()

  const stats = [
    {
      title: 'मेरी उपस्थिति',
      value: '95%',
      change: '+2%',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'कुल विषय',
      value: '6',
      change: 'सक्रिय',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'आगामी परीक्षा',
      value: '3',
      change: 'इस सप्ताह',
      icon: Calendar,
      color: 'text-orange-600',
    },
    {
      title: 'अंतिम ग्रेड',
      value: 'A+',
      change: 'गणित',
      icon: Award,
      color: 'text-purple-600',
    },
  ]

  const upcomingExams = [
    {
      subject: 'गणित',
      date: '2024-01-25',
      time: '10:00 AM',
      duration: '3 घंटे',
      type: 'मिड टर्म',
    },
    {
      subject: 'हिंदी',
      date: '2024-01-28',
      time: '11:00 AM',
      duration: '2 घंटे',
      type: 'यूनिट टेस्ट',
    },
    {
      subject: 'अंग्रेजी',
      date: '2024-01-30',
      time: '09:00 AM',
      duration: '2 घंटे',
      type: 'असाइनमेंट',
    },
  ]

  const recentResults = [
    {
      subject: 'गणित',
      marks: '85/100',
      grade: 'A+',
      exam: 'मिड टर्म',
      date: '2024-01-15',
    },
    {
      subject: 'हिंदी',
      marks: '78/100',
      grade: 'A',
      exam: 'यूनिट टेस्ट',
      date: '2024-01-10',
    },
    {
      subject: 'अंग्रेजी',
      marks: '92/100',
      grade: 'A+',
      exam: 'असाइनमेंट',
      date: '2024-01-08',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          छात्र डैशबोर्ड
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          स्वागत है, {session?.user?.name}! आपकी प्रगति यहां देखें।
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
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              आगामी परीक्षाएं
            </CardTitle>
            <CardDescription>
              अगली परीक्षाओं की जानकारी
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
                      <Clock className="h-3 w-3" />
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
              <Award className="h-5 w-5" />
              हाल के परिणाम
            </CardTitle>
            <CardDescription>
              आपके हाल के परीक्षा परिणाम
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
                    <div className="font-bold text-lg">{result.marks}</div>
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
          <CardTitle>त्वरित कार्य</CardTitle>
          <CardDescription>
            सामान्य कार्यों के लिए शॉर्टकट
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium">टाइम टेबल</div>
              <div className="text-sm text-gray-500">कक्षा शेड्यूल</div>
            </button>
            <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium">असाइनमेंट</div>
              <div className="text-sm text-gray-500">होमवर्क</div>
            </button>
            <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium">लाइब्रेरी</div>
              <div className="text-sm text-gray-500">किताबें</div>
            </button>
            <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="font-medium">फीस</div>
              <div className="text-sm text-gray-500">भुगतान</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
