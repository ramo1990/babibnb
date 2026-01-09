def build_safe_message(message, conversation_id, client_id=None):
    """Construct a standardized safe_message payload for WebSocket transmission."""
    safe_message = {
        "id": str(message.id),
        "conversation": str(conversation_id),
        "content": message.content,
        "created_at": message.created_at.isoformat(),
        "sender": {
            "id": str(message.sender.id),
            "name": message.sender.name,
            "email": message.sender.email or "",
            "image": message.sender.image.url if message.sender.image else None,
            "favoriteIds": [], # TODO: Populate from user favorites when implemented
        },
        "is_read": message.is_read
    }
    if client_id:
        safe_message["client_id"] = client_id
    return safe_message