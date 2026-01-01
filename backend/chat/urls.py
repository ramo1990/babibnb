from django.urls import path
from .views import ConversationCreateView, ConversationInfoView, MessageCreateView, ConversationMessagesView, ConversationListView


urlpatterns = [
    path("conversations/", ConversationListView.as_view(), name="conversation-list"),
    path("conversations/<uuid:conversation_id>/", ConversationMessagesView.as_view(), name="conversation-detail"),
    path("conversations/<uuid:conversation_id>/info/", ConversationInfoView.as_view()),
    path("conversations/create/", ConversationCreateView.as_view(), name="conversation-create"),
    path("messages/create/", MessageCreateView.as_view(), name="message-create"),
]