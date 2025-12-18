"use client"

import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { SubmitHandler, useForm } from 'react-hook-form'
import useRegisterModal from '@/lib/useRegisterModal'
import Modal from './Modal'
import Heading from '../Heading'
import Input from '../inputs/Input'
import { toast } from 'react-hot-toast'
import { Button } from '../ui/button'
import { FaFacebook } from 'react-icons/fa'
import { api } from '@/lib/axios'
import { LoginFormValues } from '@/lib/types'
import useLoginModal from '@/lib/useLoginModal'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/lib/useAuthStore'
import { getCurrentUser } from '@/lib/getCurrentUser'


// TODO: migrer Input vers une version shadcn/ui
// ajouter une validation côté client (ex: email valide, mot de passe minimum 6 caractères) directement avec react-hook-form.
const LoginModal = () => {
    const router = useRouter()
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal()
    const [isLoading, setIsLoading] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormValues>({defaultValues: {
        email: '',
        password: '',
    }})

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        try {
            setIsLoading(true);

            // Login
            const tokensRes = await api.post('/login/', { email: data.email, password: data.password })
            const {access, refresh} = tokensRes.data
            if (typeof window !== "undefined") {
                localStorage.setItem('access', access)
                localStorage.setItem('refresh', refresh)
            }

            // Récupérer l'utilisateur courant
            const user = await getCurrentUser()
            useAuthStore.getState().setUser(user)

            toast.success('Logged in successfully')
            loginModal.onClose() // ferme la modal si succès
        } catch (error: any) { 
            console.error(' Erreur login:', error.response?.data || error)
            toast.error('Email ou mot de passe incorrect'); // affiche une erreur
        } finally {
            setIsLoading(false)
        }
    }

    // Contenu du corps
    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading  
                title='Welcome back'
                subtitle='Login to your account!'
            />
            <Input id='email' label='Email' disabled={isLoading} register={register} errors={errors} required />
            <Input id='password' type='password' label='Password' disabled={isLoading} register={register} errors={errors} required />
        </div>
    )
    
    // Contenu du pied de page
    const footerContent = (
        <div className='flex flex-col gap-4'>
            <hr />
            <Button variant="outline" label='Continue with Google' icon={FcGoogle} onClick={() => {}}/>
            <Button variant="outline" label='Continue with Facebook' icon={FaFacebook} onClick={() => {}}/>
            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    Don't have an account? 
                    <div 
                    onClick={() => {
                        loginModal.onClose()
                        registerModal.onOpen()
                    }}
                        className='text-neutral-950 cursor-pointer hover:underline'>
                        Sign up
                    </div>
                </div>
            </div>
        </div>
    )
    
    return (
        <Modal 
            disabled= {isLoading}
            isOpen= {loginModal.isOpen}
            title='Login'
            actionLabel='Continue'
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
            />
    )
}

export default LoginModal
