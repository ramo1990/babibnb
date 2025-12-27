from rest_framework import serializers
from .models import Reservation

class ReservationSerializer(serializers.ModelSerializer):
    startDate = serializers.DateField(format="%Y-%m-%d")
    endDate = serializers.DateField(format="%Y-%m-%d")
    
    class Meta:
        model = Reservation
        fields = [
            "id",
            "user",
            "listing",
            "startDate",
            "endDate",
            "totalPrice",
            "created_at",
        ]
        read_only_fields = ("id", "user", "created_at")
