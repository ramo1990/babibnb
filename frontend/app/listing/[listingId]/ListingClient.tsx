'use client'

import Container from '@/components/Container'
import ListingHead from '@/components/listings/ListingHead'
import ListingInfo from '@/components/listings/ListingInfo'
import { categoryItems } from '@/components/navbar/Categories'
import { CurrentUserType, ListingType } from '@/lib/types'
import React, { useMemo } from 'react'


interface ListingClientProps {
    // reservation?: Reservation[]
    listing: ListingType
    currentUser: CurrentUserType | null
}

// TODO: optimiser la page pour le SEO

const ListingClient = ({listing, currentUser}: ListingClientProps) => {
    // Calcul de la catégorie
    const category = useMemo(() => {
        return categoryItems.find((item) => 
            listing.categories.includes(item.label)) // Compare correctement une string avec un tableau de strings.
    }, [listing.categories])

    return (
        <Container>
            <div className='max-w-5xl mx-auto'>
                <div className='flex flex-col gap-6'>
                    <ListingHead 
                        title={listing.title} 
                        images={listing.images} 
                        locationValue={listing.country_code}
                        city= {listing.city_name} 
                        id={listing.id} 
                        currentUser={currentUser}  
                    />

                    <div className='' >
                        <ListingInfo 
                            user={listing.owner} 
                            category={category} 
                            description={listing.description} 
                            roomCount={listing.room_count} 
                            guestCount={listing.guest_count}
                            bathroomCount={listing.bathroom_count}
                            locationValue={listing.country_code}
                            cityLat= {listing.city_lat}
                            cityLng= {listing.city_lng}
                        />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ListingClient
