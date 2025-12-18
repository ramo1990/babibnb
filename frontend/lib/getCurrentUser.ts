import { api } from '@/lib/axios';
import { CurrentUserType } from './types';
import { AxiosError } from 'axios';


// Déplacer la logique de récupération et de refresh des tokens dans un intercepteur Axios pour éviter les problèmes de sessions perdues
export const getCurrentUser = async (): Promise<CurrentUserType | null> => {
    // éviter l'accès à localStorage côté serveur
    if (typeof window === "undefined") return null

    const access = localStorage.getItem('access');
    if (!access) return null;

    try {
        const response = await api.get('/me/', {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });

        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError;

        //  si token expiré → tenter un refresh
        if (err?.response?.status === 401) {
            const refresh = localStorage.getItem("refresh");
            if (refresh) {
                try {
                    const res = await api.post('/token/refresh/', { refresh });
                    const newAccess = res.data.access;
                    localStorage.setItem("access", newAccess);

                    // relancer la requête /me/ avec le nouveau token
                    const retry = await api.get('/me/', {
                        headers: { Authorization: `Bearer ${newAccess}` },
                    });
                    return retry.data;
                } catch (refreshError) {
                    console.error("Erreur refresh token:", refreshError);
                    // nettoyage complet si refresh échoue
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                }
            } else {
                // nettoyage complet
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
            }
        }

        return null;
    }
};