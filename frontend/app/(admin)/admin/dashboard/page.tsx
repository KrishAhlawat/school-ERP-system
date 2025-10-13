'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, BookOpen, Calendar, DollarSign, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session } = useSession()

  const stats = [
    {
      title: 'कुल छात्र',
      value: '1,250',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'कुल शिक्षक',
      value: '45',
      change: '+3%',
      icon: GraduationCap,
      color: 'text-green-600',
    },
    {
      title: 'उपस्थिति दर',
      value: '94.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'आगामी परीक्षाएं',
      value: '8',
      change: 'इस सप्ताह',
      icon: BookOpen,
      color: 'text-orange-600',
    },
    {
      title: 'बकाया शुल्क',
      value: '₹2,45,000',
      change: '-5.2%',
      icon: DollarSign,
      color: 'text-red-600',
    },
    {
      title: 'आज की घटनाएं',
      value: '3',
      change: 'नई',
      icon: Calendar,
      color: 'text-indigo-600',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          प्रशासक डैशबोर्ड
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          स्वागत है, {session?.user?.name}! आज की स्थिति यहां देखें।
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {stat.change} पिछले महीने से
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>त्वरित कार्य</CardTitle>
            <CardDescription>
              सामान्य कार्यों के लिए शॉर्टकट
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="font-medium">नया छात्र</div>
                <div className="text-sm text-gray-500">छात्र जोड़ें</div>
              </button>
              <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="font-medium">उपस्थिति</div>
                <div className="text-sm text-gray-500">आज की उपस्थिति</div>
              </button>
              <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="font-medium">परीक्षा</div>
                <div className="text-sm text-gray-500">नई परीक्षा</div>
              </button>
              <button className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="font-medium">रिपोर्ट</div>
                <div className="text-sm text-gray-500">रिपोर्ट देखें</div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>हाल की गतिविधियां</CardTitle>
            <CardDescription>
              सिस्टम में हाल की गतिविधियां
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">नया छात्र रजिस्टर्ड</p>
                  <p className="text-xs text-gray-500">2 मिनट पहले</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">उपस्थिति अपडेट</p>
                  <p className="text-xs text-gray-500">15 मिनट पहले</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">परीक्षा शेड्यूल</p>
                  <p className="text-xs text-gray-500">1 घंटे पहले</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">शुल्क भुगतान</p>
                  <p className="text-xs text-gray-500">2 घंटे पहले</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
