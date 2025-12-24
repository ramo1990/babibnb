'use client'

import React, { useMemo, useState } from 'react'
import Modal from './Modal'
import useRentModal from '@/lib/useRentModal'
import Heading from '../Heading'
import { categoryItems } from '../navbar/Categories'
import CategoryInput from '../inputs/CategoryInput'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import CountrySelect from '../inputs/CountrySelect'
import dynamic from 'next/dynamic'
import CitySelect from '../inputs/CitySelect'
import { citiesByCountry } from '@/lib/cities'
import { haversineDistance } from '@/lib/distance'
import { findCountryFromCoords } from '@/lib/findCountry'
import Counter from '../inputs/Counter'
import MultiImageUpload from '../inputs/ImageUpload'
import Input from '../inputs/Input'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/axios'


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

// TODO : envoyer country + city à ton backend, afficher la ville dans le résumé de l’annonce
  
const RentModal = () => {
    const rentModal = useRentModal()
    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {register, handleSubmit, setValue, watch, formState: {errors,}, reset} = useForm<FieldValues>({
        defaultValues: {
            categories: [],
            location: null,
            city: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            images: [], // modele listing de backend
            price: 1,
            title: '',
            description: ''

        }
    })

    const categories = watch('categories') || []
    const location = watch('location')
    const city = watch('city')
    const guestCount = watch('guestCount')
    const roomCount = watch('roomCount')
    const bathroomCount = watch('bathroomCount')
    const images = watch('images')

    const countryCode = location?.value
    const cities = useMemo(() => {
        return countryCode ? citiesByCountry[countryCode] || [] : []
    }, [countryCode])
     
    // Bloquer le passage au step suivant (validation par étape)
    const validateCurrentStep = (data: FieldValues, step: STEPS) => {
        switch (step) {
          case STEPS.CATEGORY:
            if (!data.categories || data.categories.length === 0) {
              toast.error('Please select at least one category')
              return false
            }
            return true
      
          case STEPS.LOCATION:
            if (!data.location) {
              toast.error('Please select a country')
              return false
            }
            return true // city est optionnelle
      
          case STEPS.INFO:
            if (!data.guestCount || !data.roomCount || !data.bathroomCount) {
              toast.error('Please fill all info fields')
              return false
            }
            return true
      
          case STEPS.IMAGES:
            if (!data.images || data.images.length === 0) {
              toast.error('Please upload at least one image')
              return false
            }
            return true
      
          case STEPS.DESCRIPTION:
            if (!data.title || !data.description) {
              toast.error('Please fill title and description')
              return false
            }
            return true
      
          default:
            return true
        }
    }
      
    // trouver la ville la plus proche
    const findClosestCity = (coords: number[], list: {name: string; latlng: number[]} []) => {
        if (!list || list.length === 0) return null
      
        let closest = null
        let minDistance = Infinity
      
        for (const c of list) {
          const dist = haversineDistance(coords, c.latlng)
          if (dist < minDistance) {
            minDistance = dist
            closest = c
          }
        }
      
        return closest
      }

    const LocationMap = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location, city])

    
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
        if (step === STEPS.LOCATION && !location) { 
            toast.error("Please select a location") 
            return 
        }
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

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            // Validate current step before advancing
            const isValid = validateCurrentStep(data, step)
            if (!isValid) {
                return
            }
            return onNext()
        }
        setIsLoading(true)

        // console.log("Data sent to backend:", data)
        
        api.post('/listing/', data)
        .then(() => {
            toast.success('Listing created')
            router.refresh()
            reset()
            setStep(STEPS.CATEGORY)
            rentModal.onClose()
        })
        .catch((error) => {
            const message = error.response?.data?.message || error.message || 'Something went wrong'
            toast.error(`Failed to create listing: ${message}`)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    // Clique sur la carte
    const handleMapClick = (coords: number[]) => {
        const [lat, lng] = coords
        const detectedCountry = findCountryFromCoords(lat, lng)
    
        if (detectedCountry) {
            setCustomValue("location", detectedCountry)
            
            const countryCities = citiesByCountry[detectedCountry.value] || []
            const closestCity = findClosestCity(coords, countryCities)
            
            if (closestCity) {
                setCustomValue("city", closestCity)
            }
        } else {
            setCustomValue("location", location ? { ...location, latlng: coords } : {latlng: coords})
        }
    }

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

                <LocationMap 
                    center={city?.latlng ?? location?.latlng}
                    onClickMap={handleMapClick}
                />
            </div>
        )
    }

    // Listing 3: INFO
    if (step === STEPS.INFO) {        
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading title='Share some basics about your place' subtitle='What amenities do you have?'/>
                <Counter 
                    title='Guests' 
                    subtitle='How many guests do you allow?' 
                    value={guestCount} 
                    onChange={(value) => setCustomValue('guestCount', value)} 
                />
                <hr />
                <Counter 
                    title='Rooms' 
                    subtitle='How many rooms do you have?' 
                    value={roomCount} 
                    onChange={(value) => setCustomValue('roomCount', value)} 
                />
                <hr />
                <Counter 
                    title='Bathrooms' 
                    subtitle='How many bathrooms do you have?' 
                    value={bathroomCount} 
                    onChange={(value) => setCustomValue('bathroomCount', value)} 
                />
            </div>
        )
    }

    // Listing 4: Images
    if (step === STEPS.IMAGES) {        
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading title='Add a photo of your place' subtitle='Show guests what your place looks like!'/>
                <MultiImageUpload 
                    value={images} 
                    onChange={(urls) => setCustomValue('images', urls)} 
                />
            </div>
        )
    }
    
    // Listing 5: Description
    if (step === STEPS.DESCRIPTION) {        
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading title='How would you describe your place?' subtitle='Short and sweet works best!'/>
                <Input id='title' label='Title' disabled={isLoading} register={register} errors={errors} required />
                <hr />
                <Input id='description' label='Description' disabled={isLoading} register={register} errors={errors} required />
                
            </div>
        )
    }

    // Listing 5: Price
    if (step === STEPS.PRICE) {        
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading title='Now set your price?' subtitle='How much do you charge per night?'/>
                <Input id='price' label='Price' formatPrice type='number' disabled={isLoading} register={register} errors={errors} required />                
            </div>
        )
    }

    return (
        <Modal 
            isOpen={rentModal.isOpen} 
            onClose={rentModal.onClose}  
            onSubmit={handleSubmit(onSubmit)} 
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title='Airbnb your home!'
            body={bodyContent}
        />
    )
}

export default RentModal
