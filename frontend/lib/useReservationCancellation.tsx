import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { api } from "./axios"
import type { AxiosError } from "axios"


export function useReservationCancellation() {
    const [deletingId, setDeletingId] = useState("")
  
    const cancelReservation = useCallback(async (id: string, onSuccess?: () => void) => {
      setDeletingId(id)
  
      try {
        await api.delete(`/reservations/${id}/`)
        toast.success("Reservation cancelled")
        onSuccess?.()
      } catch (error) {
        const err = error as AxiosError<{ error: string }>
        toast.error(err?.response?.data?.error || "Failed to cancel reservation")
      } finally {
        setDeletingId("")
      }
    }, [])
  
    return { deletingId, cancelReservation }
  }
  