from rest_framework import serializers
from .models import CustomUser


# TODO : Rendre email ou username obligatoire
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ('id', 'name', 'email', 'password')
        # extra_kwargs = {
        #     'email': {'required': True},
        #     'username': {'required': True},
        # }

    def validate_email(self, value):
        # Vérifie que l'email n'est pas déjà utilisé.
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email déjà utilisé.")
        return value

    def create(self, validated_data):
        # Crée un nouvel utilisateur en hashant correctement le mot de passe.
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data["password"],
            name=validated_data.get('name', '')
        )
        return user