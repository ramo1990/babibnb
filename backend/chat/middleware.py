from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
from rest_framework_simplejwt.exceptions import TokenError


User = get_user_model()

@database_sync_to_async
def get_user(token_key):
    try:
        access_token = AccessToken(token_key)
        return User.objects.get(id=access_token["user_id"])
    except (TokenError, User.DoesNotExist, KeyError):
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token = params.get("token", [None])[0]
        
        scope["user"] = await get_user(token) if token else AnonymousUser()
        return await super().__call__(scope, receive, send)