import { api } from '@/lib/axios';
import { CurrentUserType } from './types';


export const getCurrentUser = async (): Promise<CurrentUserType | null> => {
    // éviter l'accès à localStorage côté serveur
    if (typeof window === "undefined") return null

    const access = localStorage.getItem('access');
    if (!access) return null;

    try {
        const response = await api.get('/me/');
        return response.data;
    } catch (error) {
        console.error("Erreur récupération utilisateur:", error);
        return null;
    }
};