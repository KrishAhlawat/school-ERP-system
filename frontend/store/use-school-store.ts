import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { School, SchoolTheme } from '@school-erp/shared'

interface SchoolState {
  currentSchool: School | null
  isLoading: boolean
  setSchool: (school: School | null) => void
  setLoading: (loading: boolean) => void
  updateTheme: (theme: Partial<SchoolTheme>) => void
  getThemeColors: () => SchoolTheme
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
      currentSchool: null,
      isLoading: false,

      setSchool: (school) => set({ currentSchool: school }),

      setLoading: (loading) => set({ isLoading: loading }),

      updateTheme: (theme) => {
        const { currentSchool } = get()
        if (currentSchool) {
          set({
            currentSchool: {
              ...currentSchool,
              theme: { ...currentSchool.theme, ...theme },
            },
          })
        }
      },

      getThemeColors: () => {
        const { currentSchool } = get()
        return currentSchool?.theme || {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          accentColor: '#06b6d4',
          fontFamily: 'Inter',
        }
      },
    }),
    {
      name: 'school-storage',
      partialize: (state) => ({
        currentSchool: state.currentSchool,
      }),
    }
  )
)
