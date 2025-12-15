"use client"

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react'


const Logo = () => {
    const router = useRouter()

    return (
        <Image 
            alt='Logo' 
            src="/logo.png"
            height={100}
            width={100}
            className='md:block cursor-pointer'
            priority
            onClick={() => router.push('/')} // redirection vers la page d'accueil
            />
    )
}

export default Logo
