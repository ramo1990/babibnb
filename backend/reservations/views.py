from decimal import Decimal, InvalidOperation
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Reservation
from .serializers import ReservationSerializer, PublicReservationSerializer
from listing.models import Listing
from datetime import datetime
from django.core.exceptions import ValidationError


class CreateReservationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        listing_id = request.data.get("listingId")
        raw_start = request.data.get("startDate") 
        raw_end = request.data.get("endDate")
        total = request.data.get("totalPrice")

        if not listing_id:
            return Response({"error": "listingId is required"}, status=400)
        
        if not raw_start or not raw_end:
            return Response({"error": "startDate and endDate are required"}, status=400)
   
        if not total:
            return Response({"error": "totalPrice is required"}, status=400)
        
        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found"}, status=404)
        
        # Convertir ISO → date
        try: 
            start = datetime.strptime(raw_start, "%Y-%m-%d").date() 
            end = datetime.strptime(raw_end, "%Y-%m-%d").date() 
        except (ValueError, TypeError): 
            return Response({"error": "Invalid date format"}, status=400)
        
        # Validate date range
        if start >= end:
            return Response({"error": "End date must be after start date"}, status=400)
   
        if start < datetime.now().date():
            return Response({"error": "Start date cannot be in the past"}, status=400)
   
        # Validate price
        try:
            total_price = Decimal(str(total))
            if total_price <= 0:
                return Response({"error": "Total price must be positive"}, status=400)
        except (ValueError, TypeError, InvalidOperation):
            return Response({"error": "Invalid total price"}, status=400)

        # Vérifier si les dates sont déjà réservées
        overlapping = Reservation.objects.filter(
            listing=listing,
            start_date__lt=end,
            end_date__gt=start
        ).exists()

        if overlapping:
            return Response({"error": "Dates already reserved"}, status=400)

        try:
            reservation = Reservation.objects.create(
                user=request.user,
                listing=listing,
                start_date=start,
                end_date=end,
                total_price=total_price
            )
        except ValidationError as e:
            return Response({'error': str(e)}, status=400)

        return Response(ReservationSerializer(reservation).data, status=201)


class ReservationsByListingView(APIView):
    def get(self, request, listing_id):
        try:
            Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found"}, status=status.HTTP_404_NOT_FOUND)
        
        reservations = Reservation.objects.filter(listing_id=listing_id)
        # serializer = ReservationSerializer(reservations, many=True)
        serializer = PublicReservationSerializer(reservations, many=True)
        return Response(serializer.data)


class UserReservationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reservations = Reservation.objects.filter(user=request.user)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
