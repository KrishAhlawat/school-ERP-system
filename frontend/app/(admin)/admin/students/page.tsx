import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function StudentsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          छात्र प्रबंधन
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          सभी छात्रों की जानकारी देखें और प्रबंधन करें
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>छात्र सूची</CardTitle>
          <CardDescription>
            यहां सभी छात्रों की सूची दिखाई जाएगी
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            छात्र प्रबंधन पेज विकसित हो रहा है...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

