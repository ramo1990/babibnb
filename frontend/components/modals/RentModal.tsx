'use client'

import React, { useMemo, useState } from 'react'
import Modal from './Modal'
import useRentModal from '@/lib/useRentModal'
import Heading from '../Heading'
import { categoryItems } from '../navbar/Categories'
import CategoryInput from '../inputs/CategoryInput'
import { FieldValues, useForm } from 'react-hook-form'
import CountrySelect from '../inputs/CountrySelect'
import dynamic from 'next/dynamic'
import CitySelect from '../inputs/CitySelect'
import { citiesByCountry } from '@/lib/cities'


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

// TODO : envoyer country + city à ton backend, afficher la ville dans le résumé de l’annonce
// TODO : ajouter l’autocomplétion Google Places
// TODO: afficher les villes les plus proches d’un point, afficher un marqueur sur la ville sélectionnée
const RentModal = () => {
    const rentModal = useRentModal()
    const [step, setStep] = useState(STEPS.CATEGORY)

    const {register, handleSubmit, setValue, watch, formState: {errors,}, reset} = useForm<FieldValues>({
        defaultValues: {
            categories: [],
            location: null,
            city: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            images: '', // modele listing de backend
            price: 1,
            title: '',
            description: ''

        }
    })

    const categories = watch('categories') || []
    const location = watch('location')
    const city = watch('city')

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location])

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    const toggleCategory = (label: string) => {
        let updated = [...categories]

        if (updated.includes(label)) {
            updated = updated.filter((item) => item !== label)
        } else {
            updated.push(label)
        }
        setCustomValue('categories', updated)
    }

    const onBack = () => {
        setStep((value) => value > STEPS.CATEGORY ? value - 1 : value)
    }

    const onNext = () => {
        setStep((value) => value <STEPS.PRICE ? value + 1 : value)
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create'
        }
        return 'Next'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }
        return 'Back'
    }, [step])

    // listing 1: Category
    let bodyContent = (
        <div>
            <Heading title='Which of these best describes your place?' subtitle='Pick a category' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'>
                {categoryItems.map((item) => (
                    <div key={item.label} className='col-span-1'>
                        <CategoryInput 
                            onClick={() => toggleCategory(item.label)}
                            selected={categories.includes(item.label)}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
    
    // listing 2: location
    if (step === STEPS.LOCATION) {        
        const countryCode = location?.value
        const cities = countryCode ? citiesByCountry[countryCode] || [] : []

        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading title='Where is your place located?' subtitle='Help guests find you!'/>
                <CountrySelect 
                    value={location}
                    onChange={(value) => {
                        setCustomValue('location', value)
                        setCustomValue('city', null) // reset city when country changes
                    }}
                />
                {cities.length > 0 && (
                    <CitySelect 
                        cities={cities}
                        value={city}
                        onChange={(value) => setCustomValue('city', value)}
                    />
                )}

                <Map center={city?.latlng ?? location?.latlng} />
            </div>
        )
    }

    return (
        <Modal 
            isOpen={rentModal.isOpen} 
            onClose={rentModal.onClose}  
            onSubmit={onNext} 
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title='Airbnb your home!'
            body={bodyContent}
        />
    )
}

export default RentModal
