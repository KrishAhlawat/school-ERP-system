import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserRole } from '@school-erp/shared'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  hasRole: (role: UserRole) => boolean
  canAccessAdmin: () => boolean
  canManageStudents: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },

      canAccessAdmin: () => {
        const { user } = get()
        return user?.role === UserRole.ADMIN
      },

      canManageStudents: () => {
        const { user } = get()
        return user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
