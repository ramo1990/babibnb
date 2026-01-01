from django.utils import timezone
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from listing.models import Listing
from rest_framework.response import Response


# creer une conversation
class ConversationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        listing_id = request.data.get("listing_id")
        guest = request.user

        listing = get_object_or_404(Listing, id=listing_id)
        host = listing.owner

        conversation, created = Conversation.objects.get_or_create(
            listing=listing,
            host=host,
            guest=guest
        )

        return Response(ConversationSerializer(conversation, context={"request": request}).data)

# envoyer un message
class MessageCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        conversation_id = request.data.get("conversation_id")
        content = request.data.get("content")

        conversation = get_object_or_404(Conversation, id=conversation_id)
        conversation.updated_at = timezone.now() 
        conversation.save()

        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content
        )

        return Response(MessageSerializer(message, context={"request": request}).data)

# récupérer tous les messages d’une conversation
class ConversationMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, id=conversation_id)
        messages = conversation.messages.all()
        return Response(MessageSerializer(messages, many=True, context={"request": request}).data)

# liste des conversations de l’utilisateur
class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # L'utilisateur peut être host OU guest
        conversations = Conversation.objects.filter(
            host=user
        ) | Conversation.objects.filter(
            guest=user
        )

        conversations = conversations.order_by("-updated_at")

        return Response(
            ConversationSerializer(conversations, many=True, context={"request": request}).data)

# infos d’une conversation
class ConversationInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, id=conversation_id)
        return Response(ConversationSerializer(conversation, context={"request": request}).data)