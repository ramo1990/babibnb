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
        const list = currentUser?.favoriteIds || [];
        return list.includes(listingId)
    }, [currentUser, listingId])

    const toggleFavorite = useCallback(async () => {

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
            if (updatedUser) {
                setUser(updatedUser)
            }
            router.refresh()

            toast.success(hasFavorited ? 'Removed from favorites' : 'Added to favorites')

        } catch (error) {
            const message = error instanceof Error 
                ? `Failed to update favorites: ${error.message}` 
                : 'Failed to update favorites'
            toast.error(message)
        }
    }, [currentUser, hasFavorited, listingId, loginModal, router, setUser])

    return {
        hasFavorited, toggleFavorite
    }
}

export default useFavorite
