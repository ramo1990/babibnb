from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Reservation
from .serializers import ReservationSerializer
from listing.models import Listing
from datetime import datetime


class CreateReservationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        listing_id = request.data.get("listingId")
        raw_start = request.data.get("startDate") 
        raw_end = request.data.get("endDate")
        total = request.data.get("totalPrice")

        if not listing_id:
            return Response({"error": "listingId is required"}, status=400)

        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response({"error": "Listing not found"}, status=404)
        
        # Convertir ISO → date
        try: 
            start = datetime.strptime(raw_start, "%Y-%m-%d").date() 
            end = datetime.strptime(raw_end, "%Y-%m-%d").date() 
        except Exception: 
            return Response({"error": "Invalid date format"}, status=400)
        
        # Vérifier si les dates sont déjà réservées
        overlapping = Reservation.objects.filter(
            listing=listing,
            startDate__lte=end,
            endDate__gte=start
        ).exists()

        if overlapping:
            return Response({"error": "Dates already reserved"}, status=400)

        reservation = Reservation.objects.create(
            user=request.user,
            listing=listing,
            startDate=start,
            endDate=end,
            totalPrice=total
        )

        return Response(ReservationSerializer(reservation).data, status=201)


class ReservationsByListingView(APIView):
    def get(self, request, listing_id):
        reservations = Reservation.objects.filter(listing_id=listing_id)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)


class UserReservationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reservations = Reservation.objects.filter(user=request.user)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
