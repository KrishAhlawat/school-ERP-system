import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            अनधिकृत पहुंच
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            आपके पास इस पेज तक पहुंचने की अनुमति नहीं है।
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <Link href="/login">
            <Button className="w-full">
              लॉगिन पेज पर वापस जाएं
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              होम पेज पर जाएं
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
