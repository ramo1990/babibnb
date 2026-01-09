import Avatar from "@/components/Avatar"
import { MessageType, ConversationType } from "@/lib/types"
import { Check, CheckCheck } from 'lucide-react';


interface Props {
  msg: MessageType
  isGrouped: boolean
  isLastMyMessage: boolean
  conversation: ConversationType
}

export const MessageItem = ({msg, isGrouped, isLastMyMessage, conversation}: Props) => {
  const otherUser = conversation.isHost ? conversation.guest : conversation.host
  const time = new Date(msg.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", })

  return (
    <div className={`flex w-full items-end gap-2 ${msg.isMine ? "justify-end" : "justify-start"}`}>

      {/* Avatar gauche */}
      {!msg.isMine && !isGrouped && (
        <div className="shrink-0">
          <Avatar src={otherUser.image ?? ""} />
        </div>
      )}

      {/* Bulle + heure + statut */}
      <div className="flex flex-col max-w-[75%]">
        <div
          className={`px-4 py-2 text-sm leading-relaxed shadow-sm transition-all ${
            msg.isMine
              ? "bg-blue-400 text-white" : "bg-white text-gray-800 border border-gray-200"
          } ${
            isGrouped
              ? "rounded-2xl"
              : msg.isMine
              ? "rounded-2xl rounded-br-none"
              : "rounded-2xl rounded-bl-none"
          }`}
        >
          {msg.content}
        </div>

        {/* Heure */}
        {!isGrouped && (
          <div
            className={`text-[11px] mt-1 ${
              msg.isMine ? "text-right text-gray-300" : "text-left text-gray-400"
            }`}
          >
            {time}
          </div>
        )}

        {/* Statut (Vu / Envoyé) */}
        {msg.isMine && isLastMyMessage && (
          <div className="text-[11px] text-gray-300 mt-0.5 self-end">
            {msg.isRead ? <CheckCheck size={14} /> : <Check size={14} />}
          </div>
        )}
      </div>

      {/* Avatar droite */}
      {msg.isMine && !isGrouped && (
        <div className="shrink-0">
        <Avatar
          src={
            conversation.isHost
              ? conversation.host.image
              : conversation.guest.image
          }
        />
      </div>
      )}
    </div>
  )
}