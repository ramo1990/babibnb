import { create } from 'zustand'
import { CurrentUserType } from '@/lib/types'
import { getCurrentUser } from './getCurrentUser'


interface AuthStore {
  currentUser: CurrentUserType | null
  setUser: (user: CurrentUserType | null) => void
  logout: () => void
  loadUser: () => Promise<void>
}

const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,

  setUser: (user) => set({ currentUser: user }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
    }
    set({ currentUser: null })
  },

  loadUser: async () => {
    try {
      const user = await getCurrentUser()
      set({ currentUser: user }) 
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error)
      set({ currentUser: null })
    }
  },
}))

export default useAuthStore