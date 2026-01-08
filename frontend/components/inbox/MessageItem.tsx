import Avatar from "@/components/Avatar"
import { MessageType, ConversationType } from "@/lib/types"

interface Props {
  msg: MessageType
  isGrouped: boolean
  isLastMyMessage: boolean
  conversation: ConversationType
}

export const MessageItem = ({msg, isGrouped, isLastMyMessage, conversation}: Props) => {
  const otherUser = conversation.isHost
    ? conversation.guest
    : conversation.host

  return (
    <div className={`flex items-end gap-2 ${msg.isMine ? "justify-end" : "justify-start"}`}>
      {/* Avatar gauche */}
      {!msg.isMine && !isGrouped && (
        <Avatar src={otherUser.image ?? ""} />
      )}

      {/* Bulle */}
      <div className="flex flex-col max-w-[70%]">
        <div
          className={`px-4 py-2 text-sm shadow-sm ${
            msg.isMine
              ? "bg-blue-400 text-white ml-auto self-end"
              : "bg-gray-100 text-gray-800 self-start"
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
          <span
            className={`text-[10px] text-gray-400 mt-1 ${
              msg.isMine ? "self-end" : "self-start"
            }`}
          >
            {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}

        {/* Statut */}
        {msg.isMine && isLastMyMessage && (
          <span className="text-[10px] text-gray-400 mt-1 self-end">
            {msg.isRead ? "Vu" : "Envoyé"}
          </span>
        )}
      </div>

      {/* Avatar droite */}
      {msg.isMine && !isGrouped && (
        <Avatar
          src={
            conversation.isHost
              ? conversation.host.image
              : conversation.guest.image
          }
        />
      )}
    </div>
  )
}