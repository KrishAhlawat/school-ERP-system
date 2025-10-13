import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            प्रमाणीकरण त्रुटि
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            लॉगिन प्रक्रिया में कुछ गलत हुआ है। कृपया दोबारा कोशिश करें।
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <Link href="/login">
            <Button className="w-full">
              दोबारा लॉगिन करें
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
