import Image from 'next/image'
import { TbPhotoPlus } from 'react-icons/tb'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors,} from "@dnd-kit/core"
import { SortableContext, useSortable, arrayMove, rectSortingStrategy, } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"


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
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative group aspect-square">
        <Image src={url} alt="Uploaded" fill className="object-cover rounded-md" />
  
        <button
          onClick={onRemove}
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

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Limite max 5 images
        if (value.length >= 5) {
            alert("Vous ne pouvez pas ajouter plus de 5 images.")
            return
        }

        // Récupérer l’URL signée
        const res = await fetch('/api/upload')
        const { url } = await res.json()

        // Envoyer le fichier vers S3
        await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {"Content-Type": file.type},
        })

        // L’URL publique = URL signée sans les paramètres
        const publicUrl = url.split("?")[0]

        // 4. Ajouter à la liste
        onChange([...value, publicUrl])
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
    
        const oldIndex = value.indexOf(active.id)
        const newIndex = value.indexOf(over.id)
    
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