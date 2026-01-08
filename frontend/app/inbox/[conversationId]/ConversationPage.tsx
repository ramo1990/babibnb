"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MessageType, ConversationType } from "@/lib/types"
import { api } from "@/lib/axios"
import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import axios from "axios"

import { formatDateLabel } from "@/lib/dates"
import { useChatWebSocket } from "@/lib/useChatWebSocket"
import { MessageItem } from "@/components/inbox/MessageItem"


interface Props {
    conversationId: string
}

const MESSAGE_GROUP_THRESHOLD_MS = 2 * 60 * 1000 // 2 minutes

const ConversationPage = ({ conversationId }: Props) => {
    const [conversation, setConversation] = useState<ConversationType | null>(null)
    const [messages, setMessages] = useState<MessageType[]>([])
    const [loading, setLoading] = useState(true)
    const [text, setText] = useState("")
    const bottomRef = useRef<HTMLDivElement | null>(null)

    const lastMyMessage = useMemo(() => messages.filter(m => m.isMine).slice(-1)[0],
        [messages]
    )  
    
    const wsRef = useChatWebSocket({ conversationId, setMessages })

    // Fetch conversation + messages 
    useEffect(() => { 
        const abortController = new AbortController()
        const fetchData = async () => { 
            try { 
                // Conversation 
                const convRes = await api.get(`/conversations/${conversationId}/info/`, {
                    signal: abortController.signal
                }) 
                setConversation(convRes.data) 
                
                // Messages 
                const msgRes = await api.get(`/conversations/${conversationId}/`, 
                {signal: abortController.signal}
                ) 
                setMessages(msgRes.data) 
            } catch (error: any) { 
                // if (error instanceof DOMException && error.name === "AbortError") return  
                // console.error("Failed to load conversation", error)
                if (axios.isCancel(error)) {
                    // Requête annulée, pas besoin de log
                    return;
                }
                console.error("Failed to load conversation", error)
            } finally { 
                if (!abortController.signal.aborted) {
                    setLoading(false)
                } 
            } 
        } 
        fetchData() 

        return () => abortController.abort()
    }, [conversationId])

    // Scroll auto
    useEffect(() => { 
        bottomRef.current?.scrollIntoView({ behavior: "smooth" }) 
    }, [messages])   
    
    // Send message
    const sendMessage = async () => {
        if (!text.trim() || !conversation) return

        const optimisticMessage: MessageType = {
            // id: `temp-${Date.now()}`, // ID temporaire
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID temporaire unique
            content: text,
            created_at: new Date().toISOString(),
            sender: conversation.isHost ? conversation.host : conversation.guest,
            isMine: true,
            isRead: false,
        }

        // affichage immédiat
        setMessages(prev => [...prev, optimisticMessage])
        setText("")

        // ENVOI WEBSOCKET 
        if (wsRef.current?.readyState === WebSocket.OPEN) {
           try {
                wsRef.current.send(JSON.stringify({ 
                    type: "send_message", 
                    content: optimisticMessage.content, 
                    client_id: optimisticMessage.id 
                }))
            } catch (err) {
                console.error("Failed to send message:", err)
                // Rollback optimistic message or show error toast
           }
        } else {
            // Rollback optimistic message or show error
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id))
            console.error("WebSocket not connected")
        }
    }

    const sortedMessages = useMemo(() => {
        return [...messages].sort(
            (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
        )
    }, [messages])

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
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {sortedMessages.map((msg, index) => {
                        const currentDate = new Date(msg.created_at).toDateString()
                        const previousDate = index > 0 ? new Date(sortedMessages[index - 1].created_at).toDateString() : null
                        const showDateSeparator = currentDate !== previousDate

                        // Grouper les messages
                        const previousMsg = sortedMessages[index - 1]
                        const isSameAuthor = previousMsg && previousMsg.isMine === msg.isMine
                        const isCloseInTime = previousMsg &&
                            Math.abs(new Date(msg.created_at).getTime() - new Date(previousMsg.created_at).getTime()) < MESSAGE_GROUP_THRESHOLD_MS

                        const isGrouped = isSameAuthor && isCloseInTime && !showDateSeparator
                        const isLastMyMessage = msg.id === lastMyMessage?.id

                        return(
                            <div key={msg.id} className="flex flex-col">
                                {/* Séparateur de date */}
                                {showDateSeparator && (
                                    <div className="w-full text-center my-4">
                                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                                        {formatDateLabel(msg.created_at)}
                                    </span>
                                    </div>
                                )}

                                {/* Message */}
                                <MessageItem
                                    msg={msg}
                                    isGrouped={isGrouped}
                                    isLastMyMessage={isLastMyMessage}
                                    conversation={conversation}
                                />
                            </div>
                        )
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t flex gap-2">
                    <input 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage()
                            }
                        }}
                        className="flex-1 border rounded-lg px-4 py-2 shadow-sm"
                        placeholder="Write a message..."
                        aria-label="Message input"
                    />
                    <Button variant="default" label="Send"
                        onClick={sendMessage}
                        className="w-auto px-3 py-2 rounded-lg"
                    />
                </div>
            </div>
        </Container>
    )
}

export default ConversationPage