from rest_framework import serializers
from .models import Reservation

class ReservationSerializer(serializers.ModelSerializer):
    startDate = serializers.DateField(source='start_date', format="%Y-%m-%d")
    endDate = serializers.DateField(source='end_date', format="%Y-%m-%d")
    totalPrice = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2)
    
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
