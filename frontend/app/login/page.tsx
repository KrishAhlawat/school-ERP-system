'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, School, User, Lock } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('वैध ईमेल दर्ज करें'),
  password: z.string().min(6, 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए'),
  schoolDomain: z.string().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        schoolDomain: data.schoolDomain,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'लॉगिन असफल',
          description: 'गलत ईमेल या पासवर्ड',
          variant: 'destructive',
        })
      } else if (result?.ok) {
        const session = await getSession()
        
        // Redirect based on role
        switch (session?.user.role) {
          case 'ADMIN':
            router.push('/admin/dashboard')
            break
          case 'TEACHER':
            router.push('/teacher/dashboard')
            break
          case 'STUDENT':
            router.push('/student/dashboard')
            break
          case 'PARENT':
            router.push('/parent/dashboard')
            break
          default:
            router.push('/dashboard')
        }

        toast({
          title: 'सफल लॉगिन',
          description: `स्वागत है, ${session?.user.name}!`,
        })
      }
    } catch (error) {
      toast({
        title: 'त्रुटि',
        description: 'कुछ गलत हुआ है। कृपया बाद में कोशिश करें।',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      toast({
        title: 'त्रुटि',
        description: 'Google लॉगिन असफल',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <School className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">School ERP System</CardTitle>
          <CardDescription>
            अपने खाते में लॉगिन करें
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                ईमेल
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                पासवर्ड
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="schoolDomain" className="text-sm font-medium">
                स्कूल डोमेन (वैकल्पिक)
              </label>
              <Input
                id="schoolDomain"
                type="text"
                placeholder="schoolname.yourapp.com"
                {...register('schoolDomain')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'लॉगिन हो रहे हैं...' : 'लॉगिन करें'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  या
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              Google के साथ लॉगिन करें
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
