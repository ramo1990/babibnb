"use client"

import Container from '@/components/Container'
import Heading from '@/components/Heading'
import ListingCard from '@/components/listings/ListingCard'
import { api } from '@/lib/axios'
import { ListingType } from '@/lib/types'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'


interface PropertiesClientProps {
    listings: ListingType[]
}

// TODO: ajouter une confirmation “Are you sure?” avant suppression, Displaying a loader during deletion
// create a reusable modal that asks "Are you sure you want to delete this property?" before proceeding with the deletion.

const PropertiesClient = ({listings}: PropertiesClientProps) => {
    const [items, setItems] = useState(listings)
    const [deletingId, setDeletingId] = useState('')

    // annulation d’une réservation
    // TODO: afficher un loader pendant la suppression
    const onCancel = useCallback( (id: string) => {
        setDeletingId(id)
    
        api.delete(`/listing/${id}/`)
        .then(() => {
            toast.success("Listing deleted")
            setItems(prev => prev.filter(item => item.id !== id))
        })
        .catch ((err) => {
            if (err?.response?.status === 403) {
                toast.error("You don't have permission to delete this property")
            } else {
                toast.error(err?.response?.data?.error || "Failed to delete property")
            }
        }) 
        .finally (() => {
          setDeletingId("")
        })
      }, [])

    return (
        <Container>
            <Heading title='Properties' subtitle="List of your properties" />

            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
                {items.map((listing) => (
                    <ListingCard 
                        key={listing.id}
                        data={listing}
                        actionId={listing.id}
                        onAction={onCancel}
                        disabled={deletingId === listing.id}
                        actionLabel='Delete property'
                    />
                ))}
            </div>
        </Container>
    )
}

export default PropertiesClient