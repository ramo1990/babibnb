'use client'

import EmptyState from '@/components/EmptyState'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { getUserReservations } from '@/lib/getReservations'
import React, { useEffect, useState } from 'react'
import TripsClient from './TripsClient'


const TripsPage = () => {

    const [currentUser, setCurrentUser] = useState<any>(null)
    const [reservations, setReservations] = useState<any[]>([])
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
    
    if (loading) return null

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
