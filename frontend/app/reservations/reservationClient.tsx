"use client"

import Container from '@/components/Container'
import Heading from '@/components/Heading'
import ListingCard from '@/components/listings/ListingCard'
import { api } from '@/lib/axios'
import { ReservationType } from '@/lib/types'
import { useReservationCancellation } from '@/lib/useReservationCancellation'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'


interface ReservationsClientProps {
    reservations: ReservationType[]
}

const ReservationsClient = ({reservations }: ReservationsClientProps) => {
    const [items, setItems] = useState(reservations)
    const {deletingId, cancelReservation} = useReservationCancellation()

    // annulation d’une réservation
    // TODO: afficher un loader pendant la suppression
    const onCancel = (id: string) => {
        cancelReservation(id, () => {
            setItems(prev => prev.filter(item => item.id != id))
        })
    }

    return (
        <Container>
            <Heading title='Reservations' subtitle="Bookings on your properties" />

            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
                {items.map((reservation) => (
                    <ListingCard 
                        key={reservation.id}
                        data={reservation.listing}
                        reservation={reservation}
                        actionId={reservation.id}
                        onAction={onCancel}
                        disabled={deletingId === reservation.id}
                        actionLabel='Cancel guest reservation'
                    />
                ))}
            </div>
        </Container>
    )
}

export default ReservationsClient
