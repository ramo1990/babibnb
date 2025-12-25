import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation';
import useLoginModal from './useLoginModal';
import toast from 'react-hot-toast';
import { api } from '@/lib/axios';
import useAuthStore from './useAuthStore';
import { getCurrentUser } from './getCurrentUser';


interface useFavoriteProps {
    listingId: string;
}

const useFavorite = ({listingId}: useFavoriteProps) => {
    const router = useRouter()
    const loginModal = useLoginModal()

    // Lire l'utilisateur directement depuis Zustand
    const setUser = useAuthStore(state => state.setUser)
    const currentUser = useAuthStore(state => state.currentUser)

    const hasFavorited = useMemo(() => {
        console.log("CURRENT USER:", currentUser)
        const list = currentUser?.favoriteIds || [];
        return list.includes(listingId)
    }, [currentUser, listingId])

    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()

        if (!currentUser) {
            return loginModal.onOpen()
        }

        try {
            let request;

            if (hasFavorited) {
                request = () => api.delete(`/favorites/${listingId}/`)
            } else {
                request = () => api.post(`/favorites/${listingId}/`)
            }

            await request()
            // Recharger l'utilisateur et mettre à jour Zustand
            const updatedUser = await getCurrentUser() 
            setUser(updatedUser)

            toast.success('Success')
        } catch (error) {
            toast.error('Something went wrong')
        }
    }, [currentUser, hasFavorited, listingId, loginModal, setUser])

    return {
        hasFavorited, toggleFavorite
    }
}

export default useFavorite
