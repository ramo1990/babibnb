import { api } from "./axios"
import { ListingType } from "./types"


export async function getUserListings(): Promise<ListingType[]> {
  try {
    const response = await api.get("/listings/me/")
    return response.data
  } catch (error) {
    console.error("Error fetching user listings:", error)
    throw error
  }
}