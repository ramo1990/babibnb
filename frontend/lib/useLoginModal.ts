import {create} from 'zustand'

interface LoginModalStore {
    isOpen: boolean;
    onOpen: () => void
    onClose: () => void
}

// TODO: une version améliorée où tu ajoutes une méthode toggle pour ouvrir/fermer la modal en un seul appel
const useLoginModal = create<LoginModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}))  

export default useLoginModal;