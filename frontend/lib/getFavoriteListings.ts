import { api } from "./axios"
import type { ListingType } from "./types"

export async function getFavoriteListings(): Promise<ListingType[]> {
  try {
    const response = await api.get("/favorites/")
    return response.data
  } catch (error) {
    console.error("Error fetching favorite listings:", error)
    return []
  }
}