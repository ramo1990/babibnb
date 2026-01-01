from rest_framework import serializers

from .models import Conversation, Message
from listing.serializers import UserSerializer


class ConversationSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True) 
    guest = UserSerializer(read_only=True) 
    lastMessage = serializers.SerializerMethodField() 
    listing = serializers.SerializerMethodField()
    isHost = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "host", "guest", "listing", "created_at", "updated_at", "lastMessage", "isHost"]

    def get_lastMessage(self, obj): 
        message = obj.messages.order_by("-created_at").first() 
        if message: 
            return MessageSerializer(message, context=self.context).data 
        return None

    def get_listing(self, obj): 
        from listing.serializers import ListingSerializer 
        return ListingSerializer(obj.listing, context=self.context).data

    def get_isHost(self, obj): 
        request = self.context.get("request") 
        return request and obj.host == request.user

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    isMine = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "conversation", "sender", "content", "created_at", "is_read", "isMine"]

    def get_isMine(self, obj): 
        request = self.context.get("request") 
        return request and obj.sender == request.user