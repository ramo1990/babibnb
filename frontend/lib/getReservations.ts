import { api } from "@/lib/axios"
import { ReservationType } from "@/lib/types"


// récupérer les réservations d’un listing
export async function getReservationsByListing(listingId: string): Promise<ReservationType[]> {
  try {
    const response = await api.get(`/reservations/listing/${listingId}/`)
    return response.data
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return []
  }
}

// récupérer les réservations de l’utilisateur connecté
// export async function getUserReservations(): Promise<ReservationType[]> {
//     try {
//       const response = await api.get(`/reservations/me/`)
//       return response.data
//     } catch (error) {
//       console.error("Error fetching user reservations:", error)
//       return []
//     }
// }
  