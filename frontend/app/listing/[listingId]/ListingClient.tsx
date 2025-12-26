'use client'

import Container from '@/components/Container'
import ListingHead from '@/components/listings/ListingHead'
import ListingInfo from '@/components/listings/ListingInfo'
import ListingReservation from '@/components/listings/ListingReservation'
import { categoryItems } from '@/components/navbar/Categories'
import { api } from '@/lib/axios'
import { CurrentUserType, ListingType, Reservation } from '@/lib/types'
import useLoginModal from '@/lib/useLoginModal'
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Range } from 'react-date-range'

interface ListingClientProps {
    reservations?: Reservation[]
    listing: ListingType
    currentUser: CurrentUserType | null
}

//  TODO: ajouter un système de disponibilité en temps réel, gérer le SEO, 
// Initialisation du range de dates
const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

// TODO: optimiser la page pour le SEO, afficher toutes les categories

const ListingClient = ({listing, currentUser, reservations=[]}: ListingClientProps) => {
    const loginModal = useLoginModal()
    const router = useRouter()

    // Calcul des dates désactivées
    const disabledDates = useMemo(() => {
        let dates: Date[] = []

        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate),
            })
            dates = [...dates, ...range]
        })
        return dates
    }, [reservations])

    // États locaux
    const [isLoading, setIsLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(listing.price)
    const [dateRange, setDateRange] = useState<Range>(initialDateRange)

    // Création d’une réservation
    const onCreateReservation = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen()
        }
        setIsLoading(true)

        api.post('/reservations/', {
            totalPrice, 
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id,
        })
        .then(() => {
            toast.success('Listing reserved!')
            setDateRange(initialDateRange)
            // Redirect to /trips
            router.refresh()
        })
        .catch(() => {
            toast.error('Something went wrong.')
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal])

    // Calcul automatique du prix total
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays( dateRange.endDate, dateRange.startDate)
            
            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price)
            } else {
                setTotalPrice(listing.price)
            }
        }  
    }, [dateRange, listing.price])

    // Détermination de la catégorie
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
                        // currentUser={currentUser}  
                    />

                    <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6' >
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

                        <div className='order-first mb-10 md:order-last md:col-span-3'>
                            <ListingReservation 
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ListingClient
