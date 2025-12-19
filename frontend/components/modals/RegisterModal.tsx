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
import { RegisterFormValues } from '@/lib/types'
import useLoginModal from '@/lib/useLoginModal'
import useAuthStore from '@/lib/useAuthStore'


// TODO: migrer Input vers une version shadcn/ui
// Apres inscription, connecté le user
// ajouter une validation côté client (ex: email valide, mot de passe minimum 6 caractères) directement avec react-hook-form.
const RegisterModal = () => {
    const loginModal = useLoginModal()
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false)

    // on récupère loadUser depuis le store Zustand
    const loadUser = useAuthStore((state) => state.loadUser)

    const {register, handleSubmit, formState: {errors}} = useForm<RegisterFormValues>({defaultValues: {
        name: '',
        email: '',
        password: '',
    }})

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
        try {
          setIsLoading(true)
          // Inscription
          await api.post('/register/', data)
          console.log('Inscription réussie')
          
          //   Login automatique
          const tokensRes = await api.post('/login/', {
            email: data.email,
            password: data.password,
          })
          const { access, refresh } = tokensRes.data
          
          if (typeof window !== "undefined") {
            localStorage.setItem('access', access)
            localStorage.setItem('refresh', refresh)
          }
    
          // Hydrater immédiatement l’utilisateur
          await loadUser()
    
          toast.success('Account created successfully')
          registerModal.onClose()
        } catch (error: any) {
          console.error('Erreur inscription:', error.response?.data || error)
          toast.error('Something went wrong')
        } finally {
          setIsLoading(false)
        }
    }
    
    // Contenu du corps
    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading  
                title='Welcome to airbnb'
                subtitle='Create an account!'
            />
            <Input id='email' label='Email' disabled={isLoading} register={register} errors={errors} required />
            <Input id='name' label='Name' disabled={isLoading} register={register} errors={errors} required />
            <Input id='password' type='password' label='Password' disabled={isLoading} register={register} errors={errors} required />
        </div>
    )
    
    // Contenu du pied de page
    const footerContent = (
        <div className='flex flex-col gap-4'>
            <hr />
            <Button 
                variant="outline" 
                label='Continue with Google' 
                icon={FcGoogle}
                onClick={() => {}}
            />
            <Button 
                variant="outline" 
                label='Continue with Facebook' 
                icon={FaFacebook}
                onClick={() => {}}
            />
            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    Already have an account? 
                    <div 
                    onClick={() => {
                        registerModal.onClose()
                        loginModal.onOpen()
                    }}
                        className='text-neutral-950 cursor-pointer hover:underline'>
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )
    
    return (
        <Modal 
            disabled= {isLoading}
            isOpen= {registerModal.isOpen}
            title='Register'
            actionLabel='Continue'
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
            />
    )
}

export default RegisterModal
