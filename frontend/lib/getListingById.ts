import { api } from "@/lib/axios";
import { ListingType } from "./types";


export const getListingById = async (id: string): Promise<ListingType | null> => {
    try {
        const response = await api.get(`/listing/${id}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching listing:", error);
        return null;
    }
};
