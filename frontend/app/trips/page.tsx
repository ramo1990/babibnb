'use client'

import EmptyState from '@/components/EmptyState'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { getUserReservations } from '@/lib/getReservations'
import React, { useEffect, useState } from 'react'
import TripsClient from './TripsClient'
import { CurrentUserType, ReservationType } from '@/lib/types'


const TripsPage = () => {

    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [reservations, setReservations] = useState<ReservationType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
          const user = await getCurrentUser()
          if (!user) {
            setLoading(false)
            return
          }
          const res = await getUserReservations()
          setCurrentUser(user)
          setReservations(res)
          setLoading(false)
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

    if (!currentUser) {
        return (
            <EmptyState title='Unauthorized' subtitle='Please login' />
        )
    }

    if (reservations.length === 0) {
        return (
        <EmptyState title='No trips found' subtitle="Looks like you havent reserved any trips." />
        )
    }

    return (
        <TripsClient  reservations={reservations} currentUser={currentUser} />
    )
}

export default TripsPage
