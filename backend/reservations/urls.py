from django.urls import path
from .views import CreateReservationView, ReservationsByListingView, UserReservationsView

urlpatterns = [
    path('reservations/', CreateReservationView.as_view(), name='reservation-create'), # POST /reservations/
    path('reservations/listing/<uuid:listing_id>/', ReservationsByListingView.as_view(), name='listing-reservations'),
    path('reservations/me/', UserReservationsView.as_view(), name='user-reservations'),
]
