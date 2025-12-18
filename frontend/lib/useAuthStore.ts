import { create } from 'zustand'
import { CurrentUserType } from '@/lib/types'


interface AuthStore {
  currentUser: CurrentUserType | null
  setUser: (user: CurrentUserType | null) => void
  logout: () => void
}
// TODO : Enrichir le store avec une fonction loadUser() qui utilise ta fonction 
// getCurrentUser pour recharger automatiquement l’utilisateur au démarrage de l’app

const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,

  setUser: (user) => set({ currentUser: user }),

  logout: () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    set({ currentUser: null })
  },
}))

export default useAuthStore