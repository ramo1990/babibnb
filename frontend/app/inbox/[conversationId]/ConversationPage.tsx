"use client"

import { useEffect, useState } from "react"
import { MessageType, ConversationType } from "@/lib/types"
import { api } from "@/lib/axios"
import Container from "@/components/Container"

interface Props {
    conversationId: string
}

const ConversationPage = ({ conversationId }: Props) => {
    const [conversation, setConversation] = useState<ConversationType | null>(null)
    const [messages, setMessages] = useState<MessageType[]>([])
    const [loading, setLoading] = useState(true)
    const [text, setText] = useState("")

    // Fetch conversation + messages 
    useEffect(() => { 
        const fetchData = async () => { 
            try { 
                // Conversation 
                const convRes = await api.get(`/conversations/${conversationId}/info/`) 
                setConversation(convRes.data) 
                
                // Messages 
                const msgRes = await api.get(`/conversations/${conversationId}/`) 
                setMessages(msgRes.data) 
            } catch (error) { 
                console.error("Failed to load conversation", error) 
            } finally { 
                setLoading(false) 
            } 
        } 
        fetchData() 
    }, [conversationId])

    const sendMessage = async () => {
        if (!text.trim()) return

        const res = await api.post("/messages/create/", {
            conversation_id: conversationId,
            content: text
        })

        setMessages((prev) => [...prev, { ...res.data, is_mine: true }])
        setText("")
    }

    if (loading) { 
        return <div className="p-4">Loading conversation...</div> 
    }

    if (!conversation) { 
        return <div className="p-4">Conversation not found</div> 
    }

    return (
        <Container >
            <div className="flex flex-col h-full">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id}
                            className={`p-3 rounded-lg max-w-[70%] ${
                                msg.isMine 
                                    ? "bg-blue-500 text-white ml-auto" 
                                    : "bg-neutral-200"
                            }`}
                        >
                            {msg.content}
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t flex gap-2">
                    <input 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                        placeholder="Write a message..."
                    />
                    <button 
                        onClick={sendMessage}
                        className="bg-blue-600 text-white px-4 rounded-lg"
                    >
                        Send
                    </button>
                </div>
            </div>
        </Container>
    )
}

export default ConversationPage