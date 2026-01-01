from django.utils import timezone
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from listing.models import Listing
from rest_framework.response import Response
from django.db.models import Q


# creer une conversation
class ConversationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        listing_id = request.data.get("listing_id")
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
class MessageCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        conversation_id = request.data.get("conversation_id")
        content = request.data.get("content")

        conversation = get_object_or_404(Conversation, id=conversation_id)

        # Verify user is a participant
        if request.user not in [conversation.host, conversation.guest]:
            return Response(
                {"error": "You are not a participant in this conversation"},
                status=403
            )

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

        # Verify user is a participant
        if request.user not in [conversation.host, conversation.guest]:
            return Response(
                {"error": "You are not a participant in this conversation"},
                status=403
            )
        
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