import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.utils import build_safe_message
from chat.models import Conversation


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        raw_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.conversation_id = str(raw_id)
        self.room_group_name = f"chat_{self.conversation_id}"

        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close()
            return
        
        # Verify user is a participant
        is_participant = await self.check_participant(user)
        if not is_participant:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    @database_sync_to_async
    def check_participant(self, user):
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            return user in [conversation.host, conversation.guest]
        except Conversation.DoesNotExist:
            return False

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        msg_type = data.get("type") 
        content = data.get("content") 
        client_id = data.get("client_id") 
        user = self.scope["user"]

        if msg_type != "send_message": 
            return
        
        if not content or not content.strip(): 
            return
        # Sauvegarde en base 
        message = await self.create_message( sender=user, content=content.strip())

        if message is None:
            # Conversation doesn't exist or was deleted
            await self.close()
            return
        
        # Construction du message pour le front
        safe_message = build_safe_message(message, self.conversation_id, client_id)
        # safe_message = { 
        #     "id": str(message.id), 
        #     "client_id": client_id, 
        #     # pour remplacer le message temporaire 
        #     "conversation": str(self.conversation_id), 
        #     "content": message.content, 
        #     "created_at": message.created_at.isoformat(), 
        #     "sender": { 
        #         "id": str(user.id), 
        #         "name": user.name, 
        #         "email": user.email or "", 
        #         "image": user.image.url if user.image else None, 
        #         "favoriteIds": [], 
        #     }, 
        #     "is_read": False 
        # }

        # Diffusion à tous les clients
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": safe_message,
            }
        )

    @database_sync_to_async
    def create_message(self, sender, content):
        from chat.models import Message, Conversation
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            return Message.objects.create(
                conversation=conversation,
                sender=sender,
                content=content
            )
        except Conversation.DoesNotExist:
            return None

    async def chat_message(self, event): 
        await self.send(text_data=json.dumps({ 
            "type": "new_message", 
            "message": event["message"] 
            }))
        
    async def read_receipt(self, event):
        await self.send(text_data=json.dumps({
            "type": "read_receipt",
            "message_ids": event["message_ids"],
        }))
