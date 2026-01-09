from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from chat.utils import build_safe_message
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
        conversation.save(update_fields=["updated_at"])

        # Sécuriser les UUID et tous les champs requis
        safe_message = build_safe_message(message, conversation.id)

        # Diffuser via WebSocket
        logger = logging.getLogger(__name__)
        try: 
            layer = get_channel_layer() 
            if layer: 
                async_to_sync(layer.group_send)( 
                    f"chat_{conversation.id!s}", { 
                        "type": "chat_message", 
                        "message": safe_message,
                    } 
                )
        except Exception:
            # Log but don't fail the request - message is already saved
            logging.warning("WebSocket broadcast failed", exc_info=True)
        
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
        unread_messages = list(
            conversation.messages.filter( 
                is_read=False 
            ).exclude(sender=request.user).values_list("id", flat=True)
        )

        conversation.messages.filter( 
            is_read=False 
        ).exclude(sender=request.user).update(is_read=True)

        if not unread_messages:
            messages = conversation.messages.all()
            return Response(MessageSerializer(messages, many=True, context={"request": request}).data)
        
        # Diffuser via WebSocket
        try: 
            layer = get_channel_layer()
            if layer:
                async_to_sync(layer.group_send)(
                    f"chat_{conversation.id!s}",
                    {
                        "type": "read_receipt",
                        "message_ids": [str(mid) for mid in unread_messages],
                    }
                )
        except Exception:
            logging.warning(f"WebSocket read_receipt broadcast failed", exc_info=True)

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