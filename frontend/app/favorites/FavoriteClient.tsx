"use client"

import Container from '@/components/Container'
import Heading from '@/components/Heading'
import ListingCard from '@/components/listings/ListingCard'
import { CurrentUserType, ListingType } from '@/lib/types'
import React, { useState } from 'react'


interface FavoriteClientProps {
    listings: ListingType[]
    currentUser?: CurrentUserType | null
}

const FavoriteClient = ({listings, currentUser}: FavoriteClientProps) => {
    const [items, setItems] = useState(listings)

    const handleFavoriteToggle = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    return (
        <Container>
            <Heading title='Favorites' subtitle="Your favorite listings" />

            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
                {items.map((listing) => (
                    <ListingCard 
                        key={listing.id}
                        data={listing}
                        currentUser={currentUser}
                        onFavoriteToggle={handleFavoriteToggle}
                    />
                ))}
            </div>
        </Container>
    )
}

export default FavoriteClient
