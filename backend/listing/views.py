from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializers import CreateListingSerializer, ListingSerializer

class ListingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateListingSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            listing = serializer.save()
            return Response(ListingSerializer(listing).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
