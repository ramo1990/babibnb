from uuid import UUID
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializers import CreateListingSerializer, ListingSerializer
from accounts.serializers import CurrentUserSerializer  # pour renvoyer l'user à jour
from .models import Listing
from django.shortcuts import get_object_or_404


# Vue publique GET
class ListingListView(APIView):
    permission_classes = []  # Public

    def get(self, request):
        listings = Listing.objects.all().order_by("-created_at")
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
    def get(self, request, listing_id):
        listing = get_object_or_404(Listing, id=listing_id)

        serializer = ListingSerializer(listing)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
