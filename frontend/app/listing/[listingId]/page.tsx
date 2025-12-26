'use client'

import EmptyState from '@/components/EmptyState';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { getListingById } from '@/lib/getListingById';
import React, { use, useEffect, useState } from 'react'
import ListingClient from './ListingClient';
import { CurrentUserType, ListingType } from '@/lib/types';


interface IParams {
  listingId: string;
}

// TODO: Optimiser le chargement pour éviter le flash d’écran vide
export default function ListingPage ( {params}: {params: Promise<IParams> }) {
  const {listingId} = use(params)
  const [listing, setListing] = useState<ListingType | null>(null) 
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { 
    setIsLoading(true)
    getListingById(listingId)
      .then(setListing) 
      .catch(() => setError('Failed to load listing'))
      .finally(() => setIsLoading(false))
    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => {/* User not logged in is acceptable */})
  }, [listingId])

  if (isLoading) { return (<div>Loading...</div>) } // Or a proper Skeleton/Loader component
  if (error) { return (<EmptyState title="Error" subtitle={error} />) }

  if (!listing) { return (<EmptyState />)}

  return (
    <div>
      <ListingClient listing={listing} currentUser={currentUser} />
    </div>
  )
}