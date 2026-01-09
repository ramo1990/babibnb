"use client"

import Container from '@/components/Container'
import EmptyState from '@/components/EmptyState'
import Heading from '@/components/Heading'
import ConversationItem from '@/components/inbox/Conversations'
import { api } from '@/lib/axios'
import { ConversationType } from '@/lib/types'
import axios from 'axios'
import React, { useEffect, useState } from 'react'


const InboxClient = () => {
    const [conversations, setConversations] = useState<ConversationType[]>([]) 
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => { 
        const controller = new AbortController()

        const fetchConversations = async () => { 
            try { 
                const res = await api.get("/conversations/", {
                    signal: controller.signal
                }) 
                setConversations(res.data) 
            } catch (error: any) { 
                if (axios.isCancel(error)) return
                console.error("Failed to load conversations", error) 
                const message = error.response?.data?.message || error.message || "Failed to load conversations. Please try again."
                setError(message)
            } finally { 
                setLoading(false) 
            } 
        } 
        fetchConversations() 

        return () => controller.abort()
    }, [])

    // Skeleton   
    const Skeleton = () => (
        <div className="p-4 border rounded-lg animate-pulse flex items-center gap-3"> 
            {/* Avatar */} 
            <div className="w-10 h-10 bg-neutral-300 rounded-full" /> 
            <div className="flex-1 space-y-2"> 
                <div className="h-3 w-32 bg-neutral-300 rounded" /> 
                <div className="h-3 w-48 bg-neutral-200 rounded" /> 
                <div className="h-3 w-40 bg-neutral-200 rounded" /> 
            </div> 
            
            <div className="h-3 w-10 bg-neutral-200 rounded" /> 
        </div> 
    )

    // Loading state 
    if (loading) { 
        return (
            <Container>
                <Heading title='Inbox' subtitle='Conversations with hosts and guests' />
                <div className='mt-10 flex flex-col gap-4'>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} />
                    ))}
                </div>
            </Container>
        )
    }

    // Error state
    if (error) {
        return <EmptyState title="Error" subtitle="Veuillez vous connectez pour continuer" />
    }

    // Empty state
    if (conversations.length === 0) {
        return (
            <EmptyState 
            title="No conversations yet"
            subtitle="Messages will appear here"
        />
        )
    }
    
    return (
        <Container>
            <Heading 
                title="Inbox" 
                subtitle="Conversations with hosts and guests" 
            />

            <div className="mt-10 flex flex-col gap-4">
                {conversations.map((conv) => (
                    <ConversationItem 
                        key={conv.id}
                        conversation={conv}
                    />
                ))}
            </div>
        </Container>
    )
}

export default InboxClient