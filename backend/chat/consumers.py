import json
import uuid
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

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
                "created_at": datetime.utcnow().isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "id": event["id"],
            "message": event["message"],
            "sender": event["sender"],
            "created_at": event["created_at"],
        }))
