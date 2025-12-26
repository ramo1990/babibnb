'use client'

import getCountries from '@/lib/getCountries';
import { CurrentUserType, OwnerType } from '@/lib/types'
import React from 'react'
import { IconType } from 'react-icons';
import Avatar from '../Avatar';
import ListingCategory from './ListingCategory';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../Map'), {
    ssr: false
})


interface ListingInfoProps{
    user: OwnerType;
    description: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    category: {icon: IconType; label: string; description: string} | undefined;
    locationValue: string;
    cityLat: number | null;
    cityLng: number | null;
}

// TODO: ajouter un bouton “Contact host”
const ListingInfo = ({user, description, guestCount, roomCount, bathroomCount, category, locationValue, cityLat, cityLng}: ListingInfoProps) => {
    const {getByValue} = getCountries()

    // Récupère les coordonnées du pays
    const country = getByValue(locationValue)

    // Si la ville existe → utiliser la ville 
    const coordinates = cityLat && cityLng
        ? [cityLat, cityLng]
        : country?.latlng
        
    return (
        <div className='col-span-4 flex flex-col gap-8'>
            <div className="flex flex-col gap-2">
                <div className='text-xl font-semibold flex flex-row items-center gap-2'>
                    <div>Hosted by {user?.name}</div>
                    <Avatar src={user.image} />
                </div>

                <div className='flex flex-row items-center gap-4 font-light text-neutral-500'>
                    <div>{guestCount} guests</div>
                    <div>{roomCount} rooms</div>
                    <div>{bathroomCount} bathrooms</div>
                </div>
            </div>
            <hr />

            {category && (
                <ListingCategory icon={category.icon} label={category.label} description={category.description} />
            )}
            <hr />

            <div className='text-lg font-light text-neutral-500'>
                {description}
            </div>
            <hr />
            
            <Map center={coordinates} />
        </div>
    )
}

export default ListingInfo
