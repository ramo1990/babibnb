import json
import uuid
from datetime import datetime, timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.models import Conversation


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
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

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "id": str(uuid.uuid4()),
                "message": data["message"],
                "sender": data["sender"],
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "id": event["id"],
            "message": event["message"],
            "sender": event["sender"],
            "created_at": event["created_at"],
        }))
