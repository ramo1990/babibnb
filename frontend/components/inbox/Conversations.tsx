"use client"

import { useRouter } from "next/navigation"
import { ConversationType } from "@/lib/types"
import Avatar from "../Avatar"


interface Props {
    conversation: ConversationType
}

const ConversationItem = ({ conversation }: Props) => {
    const router = useRouter()

    const otherUser = conversation.isHost 
        ? conversation.guest 
        : conversation.host

    const lastMessage = conversation.lastMessage
    const isUnread = lastMessage && !lastMessage.isRead && !lastMessage.isMine

    const formatDate = (dateString: string) => { 
        const date = new Date(dateString) 
        return date.toLocaleDateString("fr-FR", { 
            day: "numeric", month: "short" }) 
        }

    return (
        <div 
            onClick={() => router.push(`/inbox/${conversation.id}`)}
            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-neutral-100 ${isUnread ? "bg-red-50" : "bg-white"}`}
        >
            {/* Avatar */}
            <Avatar src={otherUser.image} />
            
            <div className="flex-1">
                {/* Nom */}
                <div className="font-semibold flex items-center gap-2">
                    {otherUser.name}

                    {isUnread && (
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                            Nouveau
                        </span>
                    )}
                </div>

                {/* Titre du listing */}
                <div className="text-sm text-neutral-500">
                    {conversation.listing.title}
                </div>

                {/* Aperçu du dernier message */}
                <div className="text-xs text-neutral-400 mt-1 truncate max-w-50">
                    {lastMessage?.content ?? "Auncun message"}
                </div>
            </div>

            {/* Date du dernier message */}
            {lastMessage && (
                <div className="text-[11px] text-neutral-400 whitespace-nowrap">
                    {formatDate(lastMessage.created_at)}
                </div>
            )}
        </div>
    )
}

export default ConversationItem