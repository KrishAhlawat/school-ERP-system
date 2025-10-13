import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ExamsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          परीक्षा प्रबंधन
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          परीक्षाओं को देखें और प्रबंधन करें
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>परीक्षा सूची</CardTitle>
          <CardDescription>
            यहां सभी परीक्षाओं की सूची दिखाई जाएगी
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            परीक्षा प्रबंधन पेज विकसित हो रहा है...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

