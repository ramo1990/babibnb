"use client"

import { useRouter } from "next/navigation"
import { ConversationType } from "@/lib/types"


interface Props {
    conversation: ConversationType
}

// TODO: ajouter avatar, badge "non lu", date du dernier message
const ConversationItem = ({ conversation }: Props) => {
    const router = useRouter()

    const otherUser = conversation.isHost 
        ? conversation.guest 
        : conversation.host

    return (
        <div 
            onClick={() => router.push(`/inbox/${conversation.id}`)}
            className="p-4 border rounded-lg cursor-pointer hover:bg-neutral-100 transition"
        >
            <div className="font-semibold">{otherUser.name}</div>
            <div className="text-sm text-neutral-500">
                {conversation.listing.title}
            </div>
            <div className="text-xs text-neutral-400 mt-1">
                Last message: {conversation.lastMessage?.content ?? "No messages yet"}
            </div>
        </div>
    )
}

export default ConversationItem