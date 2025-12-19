"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { api } from "@/lib/axios"
import useAuthStore from "@/lib/useAuthStore"

export default function GoogleSync() {
  const { data: session } = useSession()
  const loadUser = useAuthStore((state) => state.loadUser)

  useEffect(() => {
    const syncUser = async () => {
      if (session?.user?.email) {
        try {
          const res = await api.post("/auth/google/", {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
          })
          const { access, refresh } = res.data
          localStorage.setItem("access", access)
          localStorage.setItem("refresh", refresh)
          await loadUser()
        } catch (err) {
          console.error("Erreur sync Google:", err)
        }
      }
    }
    syncUser()
  }, [session, loadUser])

  return null
}
