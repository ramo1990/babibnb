"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Avatar from '../Avatar'
import MenuItem from './MenuItem'
import { MenuIcon } from 'lucide-react'
import useRegisterModal from '@/lib/useRegisterModal'
import useLoginModal from '@/lib/useLoginModal'
import toast from 'react-hot-toast'
import useAuthStore from '@/lib/useAuthStore'
import { useSession } from "next-auth/react"
import useRentModal from '@/lib/useRentModal'
import { useRouter } from 'next/navigation'


const UserMenu = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const { currentUser, logout } = useAuthStore()
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const rentModal = useRentModal()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null) 
    // renvoie la valeur opposée de la valeur actuelle; dans ce cas true
    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, [])

    // Fermer si clic en dehors
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return() =>{
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Fonction logout
    const handleLogout = () => {
        logout()
        toast.success("Déconnecté avec succès")
        setIsOpen(false)
    }
    
    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen()
        }
        // Open rent Modal
        rentModal.onOpen()
    }, [currentUser, loginModal, rentModal])

    return (
        <div className='relative' ref={menuRef}>
            <div className='flex flex-row items-center gap-3'>
                <div 
                    onClick={onRent}
                    className='hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer'>
                    Airbnb my home
                </div>

                <div 
                    onClick={toggleOpen}
                    className='px-4  md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full 
                                cursor-pointer hover:shadow-md transition'>
                    <MenuIcon className='w-9 h-9 md:w-5 md:h-5'/> {/* petit sur grand ecran et grand sur mobile */}
                    <div className=' hidden md:block '> 
                        <Avatar src={currentUser?.image || session?.user?.image} /> 
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm'>
                    <div className='flex flex-col cursor-pointer'>
                        {/* si le user en connecté */}
                        {currentUser ? (
                            <>
                                <MenuItem onClick={() => { router.push("/trips"); setIsOpen(false) }} label= 'My trips' />
                                <MenuItem onClick={() => { router.push("/favorites"); setIsOpen(false) }} label= 'My favorites' />
                                <MenuItem onClick={() => { router.push("/reservations"); setIsOpen(false) }} label= 'My reservations' />
                                <MenuItem onClick={() => {}} label= 'My properties' />
                                <MenuItem onClick={rentModal.onOpen} label= 'Airbnb my home' />
                                <hr />
                                <MenuItem onClick={handleLogout} label= 'Logout' />
                            </>
                        ): (
                            <>
                                <MenuItem onClick={loginModal.onOpen} label= 'Login' />
                                <MenuItem onClick={registerModal.onOpen} label= 'Sign up' />
                            </>
                        )}
                        
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu
