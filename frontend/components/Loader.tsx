"use client"

import React from 'react'
import {PuffLoader} from 'react-spinners'

// TODO: créer une version squelettique (skeleton loader)
const Loader = () => {
    return (
        <div className='h-[70vh] flex flex-col justify-center items-center'>
            <PuffLoader size={100} color='red' />
        </div>
    )
}

export default Loader
