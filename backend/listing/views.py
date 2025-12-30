from uuid import UUID
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status

from .serializers import CreateListingSerializer, ListingSerializer
from accounts.serializers import CurrentUserSerializer  # pour renvoyer l'user à jour
from .models import Listing
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime

# TODO: ajouter un filtre par prix, un filtre par type de logement, ou même un filtre par distance.

# Vue publique qui retourne les listings filtrés
class ListingListView(APIView):
    permission_classes = []  # Public

    def get(self, request):
        listings = Listing.objects.all().order_by("-created_at")

        # Récupération des filtres
        location = request.query_params.get("locationValue") 
        guest_count = request.query_params.get("guestCount") 
        room_count = request.query_params.get("roomCount") 
        bathroom_count = request.query_params.get("bathroomCount") 
        start_date = request.query_params.get("startDate") 
        end_date = request.query_params.get("endDate")
        # category = request.query_params.get("category")

        # Filtre par catégorie(JSONField)
        # if category: 
        #     listings = listings.filter(categories__contains=[category])
        # Filtre par pays 
        if location: 
            listings = listings.filter(country_code=location) 
        # Filtre par nombre de personnes 
        if guest_count: 
            try:
                guest_count = int(guest_count)
                if guest_count < 1:
                    return Response({"error": "guestCount must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)
                listings = listings.filter(guest_count__gte=guest_count)
            except ValueError:
                return Response({"error": "Invalid guestCount parameter"}, status=status.HTTP_400_BAD_REQUEST) 
            
        # Filtre par nombre de chambres 
        if room_count: 
            try:
                room_count = int(room_count)
                if room_count < 1:
                    return Response({"error": "roomCount must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)
                listings = listings.filter(room_count__gte=room_count)
            except ValueError:
                return Response({"error": "Invalid roomCount parameter"}, status=status.HTTP_400_BAD_REQUEST) 
            
        # Filtre par nombre de salles de bain 
        if bathroom_count: 
            try:
                bathroom_count = int(bathroom_count)
                if bathroom_count < 1:
                    return Response({"error": "bathroomCount must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)
                listings = listings.filter(bathroom_count__gte=bathroom_count)
            except ValueError:
                return Response({"error": "Invalid bathroomCount parameter"}, status=status.HTTP_400_BAD_REQUEST) 
            
        # Filtre par disponibilité (éviter les dates déjà réservées) 
        if start_date and end_date: 
            start = parse_datetime(start_date) 
            end = parse_datetime(end_date)

            if not start and not end:
                return Response(
                    {"error": "Invalid date format. Expected ISO 8601 format."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if start >= end:
                return Response(
                    {"error": "Start date must be before end date."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            listings = listings.exclude( 
                reservations__start_date__lt=end, 
                reservations__end_date__gt=start 
            )

        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)

# Vue privée POST
class ListingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateListingSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            try:
                listing = serializer.save()
                return Response(ListingSerializer(listing).data, status=status.HTTP_201_CREATED)
            except (KeyError, ValueError, TypeError) as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': "An error occured while creating the listing"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Listing detail
class ListingDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request, listing_id):
        listing = get_object_or_404(Listing, id=listing_id)
        serializer = ListingSerializer(listing)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # TODO: empêcher la suppression si le listing a des réservations en cours
    def delete(self, request, listing_id):
        listing = get_object_or_404(Listing, id=listing_id)
        # Vérifier que l'utilisateur est bien le propriétaire 
        if listing.owner != request.user: 
            return Response( 
                {"error": "You are not allowed to delete this listing."}, 
                status=status.HTTP_403_FORBIDDEN 
            )
        listing.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# Favori
class FavoriteToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, listing_id):
        """
        Ajouter un listing aux favoris de l'utilisateur courant
        """
        user = request.user

        listing = get_object_or_404(Listing, id=listing_id)
        user.favorites.add(listing)

        return Response(
            CurrentUserSerializer(user).data,
            status=status.HTTP_200_OK,
        )

    def delete(self, request, listing_id):
        """
        Retirer un listing des favoris de l'utilisateur courant
        """
        user = request.user

        listing = get_object_or_404(Listing, id=listing_id)
        user.favorites.remove(listing)

        return Response(
            CurrentUserSerializer(user).data,
            status=status.HTTP_200_OK,
        )

# Listes des favoris
class FavoriteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Récupérer tous les listings favoris de l'utilisateur connecté
        """
        user = request.user
        favorites = user.favorites.all()

        serializer = ListingSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Le propriété
class UserListingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        listings = Listing.objects.filter(owner=request.user)
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)
