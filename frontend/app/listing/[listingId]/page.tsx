'use client'

import EmptyState from '@/components/EmptyState';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { getListingById } from '@/lib/getListingById';
import React, { use, useEffect, useState } from 'react'
import ListingClient from './ListingClient';
import { CurrentUserType, ListingType, ReservationType } from '@/lib/types';
import { getReservationsByListing } from '@/lib/getReservations';


interface IParams {
  listingId: string;
}

// TODO: Optimiser le chargement pour éviter le flash d’écran vide
export default function ListingPage ( {params}: {params: Promise<IParams> }) {
  const {listingId} = use(params)

  const [listing, setListing] = useState<ListingType | null>(null) 
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
  const [reservations, setReservations] = useState<ReservationType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
  
    Promise.all([
      getListingById(listingId),
      getCurrentUser(),
      getReservationsByListing(listingId)
    ])
      .then(([listingData, userData, reservationsData]) => {
        setListing(listingData)
        setCurrentUser(userData)
        setReservations(reservationsData)
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setIsLoading(false))
  }, [listingId])
  
  if (isLoading) { return (<div>Loading...</div>) } // Or a proper Skeleton/Loader component
  if (error) { return (<EmptyState title="Error" subtitle={error} />) }
  if (!listing) { return (<EmptyState />)}

  return (
    <div>
      <ListingClient listing={listing} currentUser={currentUser} reservations={reservations}/>
    </div>
  )
}