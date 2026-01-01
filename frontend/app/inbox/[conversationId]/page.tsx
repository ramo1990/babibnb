import ConversationPage from "./ConversationPage"

interface Params {
    conversationId: string
}

export const dynamic = "force-dynamic"

export default async function ConversationDetailPage({ params }: { params: Promise<Params> }) {
    const { conversationId } = await params
    return <ConversationPage conversationId={conversationId} />
}