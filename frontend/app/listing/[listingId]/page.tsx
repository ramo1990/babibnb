'use client'

import EmptyState from '@/components/EmptyState';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { getListingById } from '@/lib/getListingById';
import React, { use, useEffect, useState } from 'react'
import ListingClient from './ListingClient';


interface IParams {
  listingId: string;
}

// TODO: Optimiser le chargement pour éviter le flash d’écran vide
export default function ListingPage ( {params}: {params: Promise<IParams> }) {
  const {listingId} = use(params)
  const [listing, setListing] = useState<any>(null) 
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => { 
    getListingById(listingId).then(setListing) 
    getCurrentUser().then(setCurrentUser) 
  }, [listingId])

  if (!listing) { return (<EmptyState />)}

  return (
    <div>
      <ListingClient listing={listing} currentUser={currentUser} />
    </div>
  )
}