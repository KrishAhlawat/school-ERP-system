import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReportsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          रिपोर्ट्स
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          विभिन्न रिपोर्ट्स देखें और डाउनलोड करें
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>रिपोर्ट्स</CardTitle>
          <CardDescription>
            यहां सभी रिपोर्ट्स उपलब्ध होंगी
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            रिपोर्ट्स पेज विकसित हो रहा है...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

