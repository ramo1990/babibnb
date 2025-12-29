'use client'

import getCountries from '@/lib/getCountries';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react'
import {format} from 'date-fns'
import Image from 'next/image'
import { CurrentUserType, ListingType, ReservationType } from '@/lib/types';
import HeartButton from '../HeartButton';
import { Button } from '../ui/button';


interface ListingCardProps {
    data: ListingType;
    reservation?: ReservationType;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: CurrentUserType | null;
    onFavoriteToggle?: (id: string) => void;
}

// TODO: ajouter un skeleton loader, afficher plusieurs images en carousel

const ListingCard = ({data, onAction, disabled, actionLabel, actionId, reservation, currentUser, onFavoriteToggle}: ListingCardProps) => {
    const router = useRouter()
    const isFavorite = currentUser?.favoriteIds?.includes(data.id)
    const {getByValue} = getCountries()

    const location = getByValue(data.country_code)

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (disabled || !actionId) {
            return
        }

        onAction?.(actionId)
    }, [onAction, actionId, disabled])

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }
        return data.price
    }, [reservation, data.price])

    const reservationDate = useMemo(() => {
        if (!reservation) {
            return null;
        }
        const start = new Date(reservation.startDate)
        const end = new Date(reservation.endDate)

        return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [reservation])

    return (
        <div 
            onClick={() => router.push(`/listing/${data.id}/`)} 
            className='col-span-1 cursor-pointer group'
        >
            <div className='flex flex-col gap-2 w-full'>
                <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
                    <Image fill alt='Listing' src={data.images[0]} className='object-cover h-full w-full group-hover:scale-110 transition'  />
                    <div className='absolute top-3 right-3'>
                        <HeartButton 
                        listingId={data.id} 
                        onToggle={() => onFavoriteToggle?.(data.id)}
                        />
                    </div>
                </div>

                <div className='font-semibold text-lg'>
                    {data.city_name || ''}  {location?.label}, {location?.region}
                </div>

                <div className='font-light text-neutral-500'>
                    {reservationDate || data.categories} 
                </div>

                <div className='flex flex-row items-center gap-1'>
                    <div className='font-semibold'>
                        {price} $
                    </div>
                    <div>
                        {!reservation && (
                            <div className='font-light'>per night</div>
                        )}
                    </div>
                </div>

                {onAction && actionLabel && (
                    <Button disabled={disabled} size='sm' label={actionLabel} onClick={handleCancel} />
                )}
            </div>
        </div>
    )
}

export default ListingCard
