import getCountries from '@/lib/getCountries';
import { CurrentUserType } from '@/lib/types';
import React from 'react'
import Heading from '../Heading';
import Image from 'next/image'
import HeartButton from '../HeartButton';


interface ListingHeadProps {
    title: string;
    locationValue: string;
    city?: string | null
    images: string[];
    id: string;
    currentUser: CurrentUserType | null
}

// TODO: optimiser le SEO de cette page &  ajouter un système de partage (comme Airbnb)
const ListingHead = ({title, locationValue, city, images, id, currentUser}: ListingHeadProps) => {
    const {getByValue} = getCountries()
    const location = getByValue(locationValue)
    const subtitleParts = [ 
        city, // peut être undefined 
        location?.label, // pays 
        location?.region // continent 
    ].filter(Boolean)  // enlève les undefined

    return (
        <>
            <Heading title={title} subtitle={subtitleParts.join(", ")} />
            <div className='w-full h-[60vh] overflow-hidden rounded-xl relative'>
                {/* TODO: afficher toutes les images en carousel ou autres */}
                <Image alt="Image" src={images[0]} fill className='object-cover w-full' />

                <div className='absolute top-5 right-5' >
                    <HeartButton listingId={id} />
                </div>
            </div>
        </>
    )
}

export default ListingHead
