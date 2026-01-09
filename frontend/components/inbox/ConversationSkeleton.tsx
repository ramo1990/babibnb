export const ConversationSkeleton = () => {
    return (
        <div className="flex flex-col h-full animate-pulse">

            {/* HEADER */}
            <div className="flex items-center gap-4 p-4 border-b bg-white sticky top-20 z-10">
                <div className="w-14 h-14 bg-gray-200 rounded-lg" />

                <div className="flex flex-col gap-2 flex-1">
                    <div className="w-40 h-4 bg-gray-200 rounded" />
                    <div className="w-28 h-3 bg-gray-200 rounded" />
                </div>

                <div className="w-24 h-9 bg-gray-200 rounded-lg" />
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">

                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <div className="w-40 h-4 bg-gray-300 rounded" />
                        <div className="w-32 h-4 bg-gray-200 rounded" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="flex flex-col gap-2 items-end">
                        <div className="w-48 h-4 bg-gray-300 rounded" />
                        <div className="w-28 h-4 bg-gray-200 rounded" />
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <div className="w-36 h-4 bg-gray-300 rounded" />
                        <div className="w-20 h-4 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>

            {/* INPUT */}
            <div className="p-4 border-t bg-white flex items-center gap-3">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
                <div className="w-20 h-10 bg-gray-300 rounded-lg" />
            </div>
        </div>
    )
}