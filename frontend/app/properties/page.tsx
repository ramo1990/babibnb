'use client'

import EmptyState from '@/components/EmptyState'
import { getCurrentUser } from '@/lib/getCurrentUser'
import React, { useEffect, useState } from 'react'
import { CurrentUserType, ListingType } from '@/lib/types'
import PropertiesClient from './PropertiesClient'
import { getUserListings } from '@/lib/getUserListings'
import Container from '@/components/Container'


const PropertiesPage = () => {

    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [listings, setListings] = useState<ListingType[]>([])
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

                const res = await getUserListings()

                setCurrentUser(user)
                setListings(res)
            } catch (err) {
                setError("Failed to load your properties. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])
    
    // Skeleton
    if (loading) {
        return (
            <Container>
                <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-neutral-200 rounded-lg" />
                            <div className="h-4 bg-neutral-200 rounded mt-2" />
                            <div className="h-4 bg-neutral-200 rounded mt-1 w-2/3" />
                        </div>
                    ))}
                </div>
            </Container>
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

    if (listings.length === 0) {
        return (
        <EmptyState title='No properties found' subtitle="Looks like you have no properties." />
        )
    }

    return (
        <PropertiesClient  listings={listings} currentUser={currentUser} />
    )
}

export default PropertiesPage