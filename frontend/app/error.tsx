'use client'

import EmptyState from '@/components/EmptyState'
import React, { useEffect } from 'react'


interface ErrorStateProps {
    error: Error
}

const ErrorState = ({error}: ErrorStateProps) => {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <EmptyState title='Oh mince' subtitle="Quelque chose s'est mal passé" />
    )
}

export default ErrorState
