import { api } from "@/lib/axios";
import { ListingType } from "./types";


export const getListingById = async (id: string): Promise<ListingType | null> => {
    try {
        const response = await api.get(`/listing/${id}/`);
        console.log("API RESPONSE:", response.data)
        return response.data;
    } catch (error) {
        console.error("Erreur récupération listing:", error);
        return null;
    }
};
