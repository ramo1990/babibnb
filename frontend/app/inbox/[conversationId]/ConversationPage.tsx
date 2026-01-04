"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MessageType, ConversationType } from "@/lib/types"
import { api } from "@/lib/axios"
import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import Avatar from "@/components/Avatar"


interface Props {
    conversationId: string
}

const MESSAGE_GROUP_THRESHOLD_MS = 2 * 60 * 1000 // 2 minutes
const WS_URL = process.env.NEXT_PUBLIC_WS_URL!

const ConversationPage = ({ conversationId }: Props) => {
    const [conversation, setConversation] = useState<ConversationType | null>(null)
    const [messages, setMessages] = useState<MessageType[]>([])
    const [loading, setLoading] = useState(true)
    const [text, setText] = useState("")
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const wsRef = useRef<WebSocket | null>(null);

    const otherUser = conversation?.isHost ? conversation?.guest : conversation?.host

    const lastMyMessage = useMemo(() => messages.filter(m => m.isMine).slice(-1)[0],
        [messages]
    )

    const formatDateLabel = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)
    
        if (date.toDateString() === today.toDateString()) return "Aujourd’hui"
        if (date.toDateString() === yesterday.toDateString()) return "Hier"
    
        return date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }
    
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
                const msgRes = await api.get(`/conversations/${conversationId}/`, {
                    signal: abortController.signal
                }) 
                setMessages(msgRes.data) 
            } catch (error) { 
                if (error instanceof DOMException && error.name === "AbortError") return  
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

    // WebSocket
    useEffect(() => {
        if (!conversation || !conversationId) return;
    
        const ws = new WebSocket(`${WS_URL}/ws/chat/${conversationId}/`);
        wsRef.current = ws;

        ws.onopen = () => console.log("WS connected")

        ws.onmessage = (event) => {
            // if (!conversation) return;
            const data = JSON.parse(event.data);
            
            setMessages((prev) => {
                // éviter les doublons
                if (prev.some(m => m.id === data.id)) return prev;

                const senderUser = data.sender === conversation.host.id ? conversation.host : conversation.guest;
                const currentUser = conversation.isHost ? conversation.host : conversation.guest;
                
                return [
                    ...prev,
                    {
                        id: data.id,
                        content: data.message,
                        created_at: data.created_at ?? new Date().toISOString(),
                        sender: senderUser,
                        isMine: data.sender === currentUser?.id,
                        isRead: false,
                    }
                ]
            });
        };
    
        ws.onerror = (err) => console.error("WS error", err);
        ws.onclose = () => console.log("WS closed");
    
        return () => ws.close();
    }, [conversation, conversationId]);
    
    // Send message
    const sendMessage = async () => {
        if (!text.trim()) return

        const currentUser = conversation?.isHost ? conversation.host : conversation?.guest;
        // Envoyer via WebSocket 
        // if (wsRef.current?.readyState === WebSocket.OPEN) { 
        //     wsRef.current.send(JSON.stringify({ 
        //         message: text, 
        //         sender: currentUser?.id 
        //     })); 
        // }
        // Envoyer via API REST (sauvegarde DB)
        try {
            const res = await api.post("/messages/create/", {
                conversation_id: conversationId,
                content: text
            })
            // setMessages((prev) => [...prev, { ...res.data, isMine: true }])
            setText("")
        } catch (error) {
            console.error("Failed to send message", error)
        }
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
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.map((msg, index) => {
                        const currentDate = new Date(msg.created_at).toDateString()
                        const previousDate = index > 0 ? new Date(messages[index - 1].created_at).toDateString() : null
                        const showDateSeparator = currentDate !== previousDate

                        // Grouper les messages
                        const previousMsg = messages[index - 1]
                        const isSameAuthor = previousMsg && previousMsg.isMine === msg.isMine
                        const isCloseInTime = previousMsg &&
                            Math.abs(new Date(msg.created_at).getTime() - new Date(previousMsg.created_at).getTime()) < MESSAGE_GROUP_THRESHOLD_MS

                        const isGrouped = isSameAuthor && isCloseInTime && !showDateSeparator

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

                                {/* Bulle de message + avatar */}
                                <div className={`flex items-end gap-2 ${ msg.isMine ? "justify-end" : "justify-start"}`}>

                                {/* Avatar host */}
                                {!msg.isMine && !isGrouped && (
                                    <Avatar src={otherUser?.image} />
                                )}

                                {/* Bulle */}
                                <div className="flex flex-col max-w-[70%]">
                                    <div className={`px-4 py-2 text-sm shadow-sm ${
                                            msg.isMine ? "bg-blue-400 text-white ml-auto self-end" 
                                                : "bg-gray-100 text-gray-800 self-start"
                                        } ${isGrouped ? "rounded-2xl" : msg.isMine ? "rounded-2xl rounded-br-none" : "rounded-2xl rounded-bl-none"
                                    }`}
                                    >
                                    {msg.content}
                                </div>
                                
                                {/* Timestamp */}
                                {!isGrouped && (
                                    <span className={`text-[10px] text-gray-400 mt-1 ${
                                        msg.isMine ? "self-end" : "self-start"
                                    }`}>
                                        {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                )}

                                {/* Statut “envoyé / vu” */}
                                {msg.isMine && msg.id === lastMyMessage?.id && (
                                    <div className="flex items-center gap-1 mt-1 self-end">

                                        {/* Si pas encore lu */}
                                        {!msg.isRead && (
                                            <span className="text-[10px] text-gray-400">Envoyé</span>
                                        )}

                                        {/* Si lu */}
                                        {msg.isRead && (
                                            <div className="flex items-center gap-1">
                                                {/* <Avatar src={conversation?.host?.image} /> */}
                                                <span className="text-[10px] text-gray-400">Vu</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>

                            {/* Avatar user */}
                            {msg.isMine && !isGrouped && (
                                <Avatar src={conversation.isHost ? conversation.host.image : conversation.guest.image} />
                            )}
                        </div>
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