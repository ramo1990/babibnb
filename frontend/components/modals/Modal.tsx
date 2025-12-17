"use client"

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button';


interface ModalProps{
    isOpen?: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
}
// TODO: le modal se ferme aussi quand on clique sur le fond sombre (outside click)
const Modal = ({isOpen, onClose, onSubmit, title, body, footer, actionLabel, disabled, secondaryAction, secondaryActionLabel}: ModalProps) => {
    const [showModal, setShowModal] = useState(isOpen)

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen])

    const handleClose = useCallback(() => {
        if (disabled) {
            return;
        }
        setShowModal(false)
        setTimeout(() => {
            onClose();
        }, 300);
    }, [disabled, onClose])

    const handleSubmit = useCallback(() => {
        if (disabled) {
            return;
        }
        onSubmit()
    }, [disabled, onSubmit])

    const handleSecondaryAction = useCallback(() => {
        if (disabled || !secondaryAction) {
            return;
        }
        secondaryAction()
    }, [disabled, secondaryAction])

    if (!isOpen) {
        return null;
    }

    return ( 
        <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none
                            focus:outline-none bg-neutral-800/70'> {/* arriere plan sombre */}
            <div className='relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto'>
                {/* Contenu */}
                <div className={cn('translate duration-300 h-full', 
                    showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                )}>
                    <div className='translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full
                                    bg-white outline-none focus:outline-none'>
                        {/* En tete */}
                        <div className='flex items-center p-6 rounded-t justify-center relative border-b'>
                            <button
                                onClick={handleClose}
                                className='p-1 border-0 hover:opacity-70 transition absolute left-9'>
                                <X /> {/* icône de fermeture */}
                            </button>
                            <div className='text-lg font-semibold'>
                                {title}
                            </div>
                        </div>
                        {/* Corps */}
                        <div className='relative p-6 flex-auto'>
                            {body}
                        </div>
                        {/* Pied de page */}
                        <div className='flex-flex-col gap-2 p-6'>
                            <div className='flex flex-row items-center gap-4 w-full'>
                                {secondaryAction && secondaryActionLabel && (
                                    <Button 
                                    variant="outline"
                                    disabled={disabled}
                                    label={secondaryActionLabel} 
                                    onClick={handleSecondaryAction}
                                    />
                                )}
                                <Button
                                    disabled={disabled}
                                    label={actionLabel} 
                                    onClick={handleSubmit}
                                />
                            </div>
                            {footer}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
