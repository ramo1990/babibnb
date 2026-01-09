"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MessageType, ConversationType } from "@/lib/types"
import { api } from "@/lib/axios"
import Container from "@/components/Container"
import { Button } from "@/components/ui/button"
import { isCancel } from "axios"

import { formatDateLabel } from "@/lib/dates"
import { useChatWebSocket } from "@/lib/useChatWebSocket"
import { MessageItem } from "@/components/inbox/MessageItem"
import toast from "react-hot-toast"


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
    const [sending, setSending] = useState(false)
    const sendingRef = useRef(false)
    
    const wsRef = useChatWebSocket({ conversationId, setMessages })

    const sortedMessages = useMemo(() => {
        return [...messages].sort(
            (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
        )
    }, [messages])

    const lastMyMessage = useMemo(() => {
        return sortedMessages.filter(m => m.isMine && !m.id.startsWith('temp-')).slice(-1)[0]
    }, [sortedMessages])

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
                    { signal: abortController.signal }
                ) 
                setMessages(msgRes.data) 
            } catch (error: unknown) { 
                if (isCancel(error)) {
                    return;
                }
                console.error("Failed to load conversation", error)
                toast.error("Failed to load conversation. Please try again.")
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
    // TODO: checking if the user is already near the bottom before scrolling
    useEffect(() => { 
        bottomRef.current?.scrollIntoView({ behavior: "smooth" }) 
    }, [messages])   
    
    // Send message
    const sendMessage = async () => {
        if (!text.trim() || !conversation || sendingRef.current) return
        sendingRef.current = true
        setSending(true)

        const optimisticMessage: MessageType = {
            id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`, // ID temporaire unique
            content: text,
            created_at: new Date().toISOString(),
            sender: conversation.isHost ? conversation.host : conversation.guest,
            isMine: true,
            isRead: false,
        }

        // affichage immédiat
        setMessages(prev => [...prev, optimisticMessage])
        const originalText = text
        setText("")

        // ENVOI WEBSOCKET 
        // if (wsRef.current?.readyState === WebSocket.OPEN) {
            if (wsRef.current?.readyState !== WebSocket.OPEN) {
                setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id))
                setText(originalText)
                console.error("WebSocket not connected")
                toast.error("Not connected. Please check your connection.")
                sendingRef.current = false
                setSending(false)
                return
            }
            
            try {
                wsRef.current.send(JSON.stringify({ 
                    type: "send_message", 
                    content: optimisticMessage.content, 
                    client_id: optimisticMessage.id 
                }))
            } catch (err) {
                console.error("Failed to send message:", err)
                setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id))
                setText(originalText) // Restore text on failure
                toast.error("Failed to send message. Please try again.")
            } finally {
                sendingRef.current = false
                setSending(false)
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
                        disabled={sending}
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
                    <Button variant="default" label="Send" disabled={sending}
                        onClick={sendMessage}
                        className="w-auto px-3 py-2 rounded-lg"
                    />
                </div>
            </div>
        </Container>
    )
}

export default ConversationPage