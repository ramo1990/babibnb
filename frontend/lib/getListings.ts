import { ListingType } from './types';
import { apiServer } from './axiosServer';


export const getListings = async (params?: Record<string, any>): Promise<ListingType[] | null> => {
    try {
        const res = await apiServer.get('/listing/', { params });
        return res.data;
    } catch (error) {
        console.error("Erreur récupération des listings:", error);
        return null;
    }
};