import uuid
from django.db import models
from django.contrib.auth import get_user_model
from listing.models import Listing


User = get_user_model()

class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="conversations")
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="host_conversations")
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name="guest_conversations")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("listing", "host", "guest")
        indexes = [
            models.Index(fields=['host', '-updated_at']),
            models.Index(fields=['guest', '-updated_at']),
            models.Index(fields=['-updated_at']),
        ]
        
    def __str__(self):
        return f"Conversation {self.id} - {self.listing.title}"


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender.name}: {self.content[:20]}"