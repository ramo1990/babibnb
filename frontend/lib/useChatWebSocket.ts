import { useEffect, useRef } from "react"
import { MessageType } from "@/lib/types"

interface Params {
  conversationId: string
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? ""

export const useChatWebSocket = ({ conversationId, setMessages }: Params) => {
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("access")
    if (!conversationId || !WS_URL || !token) return
    const currentUserId = localStorage.getItem("user_id") // utiliser auth
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    
    const connect = () => {
      const wsUrl = token
        ? `${WS_URL}/ws/chat/${conversationId}/?token=${token}`
        : `${WS_URL}/ws/chat/${conversationId}/`

      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === "read_receipt" && Array.isArray(data.message_ids)) {
            setMessages(prev =>
              prev.map(msg =>
                data.message_ids.includes(String(msg.id))
                  ? { ...msg, isRead: true }
                  : msg
              )
            )
            return
          }
        
          if (data.type === "new_message" && data.message) {
            const raw = data.message

            // Sécurisation complète
            const sender = raw.sender || { id: "unknown", name: "Unknown", image: null }

            const msg: MessageType = {
                id: String(raw.id),
                content: raw.content ?? "",
                created_at: raw.created_at ?? new Date().toISOString(),
                sender: {
                    id: String(sender.id),
                    name: sender.name ?? "",
                    email: sender.email ?? "",
                    image: sender.image ?? null,
                    favoriteIds: sender.favoriteIds ?? [],
                },
                isMine: String(sender.id) === String(currentUserId),
                isRead: raw.is_read ?? false,
            }

            setMessages(prev => {

            // Si un message temporaire correspond au client_id → on le remplace
            if (raw.client_id) { 
                const tempIndex = prev.findIndex(m => m.id === raw.client_id) 
                if (tempIndex !== -1) { 
                    const updated = [...prev] 
                    updated[tempIndex] = msg 
                    return updated 
                } 
            }
            // Ajouter le nouveau message seulement s'il n'existe pas déjà
            if (prev.some(m => m.id === msg.id)) { return prev }
            return [...prev, msg]
            })
          }
        } catch (err) {
          console.error("Erreur WS parse / traitement:", err)
        }
      }

      ws.onclose = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++
          setTimeout(connect, 1000 * reconnectAttempts)
        }
      }

      ws.onerror = (err) => {
        console.error("WebSocket error:", err)
        ws.close()
      }
    }

    connect()
    return () => wsRef.current?.close()
  }, [conversationId, setMessages])

  return wsRef
}
