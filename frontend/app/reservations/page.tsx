'use client'

import EmptyState from '@/components/EmptyState'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { getHostReservations } from '@/lib/getReservations'
import React, { useEffect, useState } from 'react'
import { CurrentUserType, ReservationType } from '@/lib/types'
import ReservationClient from './reservationClient'


const ReservationsPage = () => {
    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [hostReservations, setHostReservations] = useState<ReservationType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            const user = await getCurrentUser()
            if (!user) {
                setLoading(false)
                return
            }

            const host = await getHostReservations()

            setCurrentUser(user)
            setHostReservations(host)
            setLoading(false)
        } 
            loadData()
        }, [])
    
    if (loading) return null

    if (!currentUser) {
        return (
            <EmptyState title='Unauthorized' subtitle='Please login' />
        )
    }

    if (hostReservations.length === 0) {
        return (
            <EmptyState title='No reservations found' subtitle="You have no reservations on your properties." />
        )
    }

    return (
        <ReservationClient  
            reservations={hostReservations}
        />
    )
}

export default ReservationsPage
