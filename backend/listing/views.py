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
            try:
                listing = serializer.save()
                return Response(ListingSerializer(listing).data, status=status.HTTP_201_CREATED)
            except (KeyError, ValueError, TypeError) as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': "An error occured while creating the listing"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
