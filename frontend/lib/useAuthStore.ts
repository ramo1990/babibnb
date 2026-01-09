import { create } from 'zustand'
import { CurrentUserType } from '@/lib/types'
import { getCurrentUser } from './getCurrentUser'
import { signOut } from "next-auth/react"


interface AuthStore {
  currentUser: CurrentUserType | null
  setUser: (user: CurrentUserType | null) => void
  logout: () => void
  loadUser: () => Promise<void>
}

const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,

  setUser: (user) => set({ currentUser: user }),

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
    }
    // Déconnecter aussi NextAuth si une session Google existe
    await signOut({redirect: false})
    set({ currentUser: null })
  },

  loadUser: async () => {
    try {
      const user = await getCurrentUser()
      set({ currentUser: user }) 

      if (typeof window !== "undefined" && user?.id) { 
        localStorage.setItem("user_id", user.id) 
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error)
      set({ currentUser: null })
    }
  },
}))

export default useAuthStore