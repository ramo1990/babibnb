import Image from 'next/image'
import { TbPhotoPlus } from 'react-icons/tb'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent} from "@dnd-kit/core"
import { SortableContext, useSortable, arrayMove, rectSortingStrategy, } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from 'react'


interface MultiImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
}

// Fonction de tri d'image
function SortableImage({ url, onRemove }: { url: string; onRemove: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: url })
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }
  
    return (
      <div ref={setNodeRef} style={style} {...attributes} className="relative group aspect-square">
        {/* Zone draggable */}
        <div {...listeners} className="cursor-grab active:cursor-grabbing h-full w-full">
            <Image src={url} alt="Uploaded" fill className="object-cover rounded-md" />
        </div>
        {/* Bouton supprimer */}
        <button
            onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onRemove()
            }}
          className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
        >
          Supprimer
        </button>
      </div>
    )
}

// TODO :  compresser les images avant upload

export default function MultiImageUpload({onChange, value}: MultiImageUploadProps) {
    const sensors = useSensors(useSensor(PointerSensor))
    const [isUploading, setIsUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Limite max 5 images
        if (value.length >= 5) {
            alert("Vous ne pouvez pas ajouter plus de 5 images.")
            return
        }

        setIsUploading(true)
        try {
        // Récupérer l’URL signée
        const res = await fetch('/api/upload')
        if (!res.ok) {
            throw new Error('Failed to get upload URL')
        }
        const { url } = await res.json()

        // Envoyer le fichier vers S3
        const uploadRes = await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {"Content-Type": file.type},
        })
        if (!uploadRes.ok) {
            throw new Error('Failed to upload image')
        }

        // L’URL publique = URL signée sans les paramètres
        const publicUrl = url.split("?")[0]

        // 4. Ajouter à la liste
        onChange([...value, publicUrl])
        } catch (error) {
            console.error('Upload error:', error)
            alert("Erreur lors de l'upload de l'image. Veuillez réessayer.")
        } finally {
            setIsUploading(false)
        }
    }

    // Fonction drag and drop
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
    
        const oldIndex = value.indexOf(active.id as string)
        const newIndex = value.indexOf(over.id as string)
    
        onChange(arrayMove(value, oldIndex, newIndex))
      }

      return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={value} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-3 gap-4">
                    {/* Bouton d’ajout */}
                    {value.length < 5 && (
                        <label className="border-dashed border-2 p-10 flex flex-col items-center justify-center cursor-pointer hover:opacity-70">
                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                            <TbPhotoPlus size={40} />
                            <span>Ajouter</span>
                        </label>
                    )}
    
                    {/* images triables */}
                    {value.map((url) => (
                        <SortableImage
                            key={url}
                            url={url}
                            onRemove={() => onChange(value.filter((img) => img !== url))}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
      )
}