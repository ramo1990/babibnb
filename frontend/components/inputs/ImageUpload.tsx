import Image from 'next/image'
import { TbPhotoPlus } from 'react-icons/tb'


interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
}

// TODO : configurer ton bucket S3 (permissions, CORS), ajouter un loader d’upload, gérer plusieurs images, compresser les images avant upload

const ImageUpload = ({onChange, value}: ImageUploadProps) => {
    const handleUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // 1. Récupérer l’URL signée
        const res = await fetch('/api/upload')
        const { url } = await res.json()
        // 2. Envoyer le fichier vers S3
        await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
                "Content-Type": file.type,
            },
        })
        // 3. L’URL publique = URL signée sans les paramètres
        const publicUrl = url.split("?")[0]

        onChange(publicUrl)
    }

    return (
        <div
            className='relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 
                flex flex-col justify-center items-center gap-4 text-neutral-600'
        >
            <input 
                type='file'
                accept='image/*'
                onChange={handleUpload}
                className='absolute inset-0 opacity-0 cursor-pointer'
            />

            <TbPhotoPlus size={50} />
            <div className='font-semibold text-lg'> Click to upload </div>

            {value && (
                <div className='absolute inset-0 w-full h-full'>
                    <Image alt='Upload' fill style={{objectFit: 'cover'}} src={value} />
                </div>
            )}
        </div>
    )
}

export default ImageUpload
