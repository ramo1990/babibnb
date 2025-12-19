from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(APIView):
    def post(self, request):
        # Mapper name -> username pour correspondre au frontend
        data = request.data.copy()
        if 'name' in data and 'username' not in data:
            data['username'] = data['name']
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Utilisateur créé avec succès"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "name": user.name,
            "email": user.email,
        })


User = get_user_model()
# TODO: valider le format de l'email
class GoogleAuthView(APIView):
    def post(self, request):
        email = request.data.get("email")
        name = request.data.get("name")
        image = request.data.get("image")

        if not email:
            return Response({"error": "Email requis"}, status=status.HTTP_400_BAD_REQUEST)

        # Créer ou récupérer l'utilisateur
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                # "username": email,   # ou name si tu veux
                "name": name or "",
                "image": image
            }
        )
        if not created and image:
            user.image = image
            user.save()

        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response({
            "access": str(access),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "image": image,  # tu peux stocker ça dans un champ profil si besoin
            }
        }, status=status.HTTP_200_OK)
