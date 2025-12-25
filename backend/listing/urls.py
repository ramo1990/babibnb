from django.urls import path
from .views import FavoriteToggleView, ListingCreateView, ListingListView

urlpatterns = [
    path("listing/", ListingListView.as_view()), # public
    path("listing/create/", ListingCreateView.as_view(), name="listing-create"), # privé
    path("favorites/<uuid:listing_id>/", FavoriteToggleView.as_view(), name="favorite-toggle"),
]
