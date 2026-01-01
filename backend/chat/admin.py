from django.contrib import admin
from .models import Conversation, Message


@admin.register(Conversation) 
class ConversationAdmin(admin.ModelAdmin): 
    list_display = ( "id", "listing", "host", "guest", "created_at", "updated_at") 
    list_filter = ( "created_at", "updated_at") 
    search_fields = ("id", "host__email", "guest__email", "listing__title") 
    readonly_fields = ("created_at", "updated_at") 
    ordering = ("-updated_at",)


@admin.register(Message) 
class MessageAdmin(admin.ModelAdmin): 
    list_display = ( "id", "conversation", "sender", "short_content", "created_at", "is_read") 
    list_filter = ("is_read", "created_at", "sender") 
    search_fields = ("content", "sender__email", "conversation__id") 
    readonly_fields = ("created_at",) 
    ordering = ("created_at",) 
    
    def short_content(self, obj): 
        return obj.content[:40] + ("..." if len(obj.content) > 40 else "") 
    short_content.short_description = "Content"