"use client"

import Container from '@/components/Container'
import EmptyState from '@/components/EmptyState'
import Heading from '@/components/Heading'
import ConversationItem from '@/components/inbox/Conversations'
import { api } from '@/lib/axios'
import { ConversationType } from '@/lib/types'
import React, { useEffect, useState } from 'react'


const InboxClient = () => {
    const [conversations, setConversations] = useState<ConversationType[]>([]) 
    const [loading, setLoading] = useState(true)
    
    useEffect(() => { 
        const fetchConversations = async () => { 
            try { 
                const res = await api.get("/conversations/") 
                setConversations(res.data) 
            } catch (error) { 
                console.error("Failed to load conversations", error) 
            } finally { 
                setLoading(false) 
            } 
        } 
        fetchConversations() 
    }, [])

    // Loading state 
    if (loading) { 
        return <EmptyState title="Loading..." subtitle="Please wait" /> 
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