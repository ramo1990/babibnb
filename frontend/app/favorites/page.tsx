'use client'

import EmptyState from '@/components/EmptyState'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { getFavoriteListings } from '@/lib/getFavoriteListings'
import React, { useEffect, useState } from 'react'
import { CurrentUserType, ListingType } from '@/lib/types'
import FavoriteClient from './FavoriteClient'


const ListingPage = () => {

    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [favorites, setFavorites] = useState<ListingType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const user = await getCurrentUser()
                if (!user) {
                    setLoading(false)
                    return
                }
                const favs = await getFavoriteListings()
                setCurrentUser(user)
                setFavorites(favs)
            } catch (err) {
                setError("Failed to load your favorites. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])
    
    // Skeleton
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div>Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <EmptyState title='Error' subtitle={error} />
        )
    }
    
    if (!currentUser) {
        return (
            <EmptyState title='Unauthorized' subtitle='Please login' />
        )
    }

    if (favorites.length === 0) {
        return (
        <EmptyState title='No favorites found' subtitle="Looks like you have no favorite listings." />
        )
    }

    return (
        <FavoriteClient  listings={favorites} currentUser={currentUser} />
    )
}

export default ListingPage
