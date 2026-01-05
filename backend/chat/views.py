from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from listing.models import Listing
from rest_framework.response import Response
from django.db.models import Q

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging


# creer une conversation
class ConversationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        listing_id = request.data.get("listing_id")
        if not listing_id:
            return Response(
                {"error": "listing_id is required"},
                status=400
            )
        
        guest = request.user

        listing = get_object_or_404(Listing, id=listing_id)
        host = listing.owner

        if host == guest:
            return Response(
                {"error": "You cannot create a conversation with yourself"},
                status=400
            )
        
        conversation, _created = Conversation.objects.get_or_create(
            listing=listing,
            host=host,
            guest=guest
        )

        return Response(ConversationSerializer(conversation, context={"request": request}).data)

# envoyer un message
# comment sécuriser l’accès aux conversations
class MessageCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        conversation_id = request.data.get("conversation_id")
        content = request.data.get("content")

        if not conversation_id:
            return Response(
                {"error": "conversation_id is required"},
                status=400
            )
    
        if not content or not content.strip():
            return Response(
                {"error": "content is required and cannot be empty"},
                status=400
            )

        conversation = get_object_or_404(Conversation, id=conversation_id)

        # Verify user is a participant
        if request.user not in [conversation.host, conversation.guest]:
            return Response(
                {"error": "You are not a participant in this conversation"},
                status=403
            )

        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content.strip()
        )

        # Mise à jour updated_at
        conversation.save(update_fields=[])

        # Diffusion WebSocket 
        try: 
            layer = get_channel_layer() 
            if layer: 
                async_to_sync(layer.group_send)( 
                    f"chat_{conversation.id}", { 
                        "type": "chat_message", 
                        "id": str(message.id), 
                        "message": message.content, 
                        "sender": str(message.sender.id), 
                        "created_at": message.created_at.isoformat(), 
                    } 
                )
        except Exception as e:
            # Log but don't fail the request - message is already saved
            logging.getLogger(__name__).warning(f"WebSocket broadcast failed: {e}")
        
        return Response(MessageSerializer(message, context={"request": request}).data)

# récupérer tous les messages d’une conversation
class ConversationMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, id=conversation_id)

        # Verify user is a participant
        if request.user not in [conversation.host, conversation.guest]:
            return Response(
                {"error": "You are not a participant in this conversation"},
                status=403
            )
        
        # Marquer les messages de l'autre utilisateur comme lus 
        conversation.messages.filter( 
            is_read=False 
        ).exclude(sender=request.user).update(is_read=True)
        
        messages = conversation.messages.all()
        return Response(MessageSerializer(messages, many=True, context={"request": request}).data)

# liste des conversations de l’utilisateur
class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # L'utilisateur peut être host OU guest
        conversations = Conversation.objects.filter(
            Q(host=user) | Q(guest=user)
        )

        conversations = conversations.order_by("-updated_at")

        return Response(
            ConversationSerializer(conversations, many=True, context={"request": request}).data)

# infos d’une conversation
class ConversationInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, id=conversation_id)
        # Verify user is a participant
        if request.user not in [conversation.host, conversation.guest]:
            return Response(
                {"error": "You are not a participant in this conversation"},
                status=403
            )
        
        return Response(ConversationSerializer(conversation, context={"request": request}).data)