from django.urls import path
from .views import FavoriteListView, FavoriteToggleView, ListingCreateView, ListingDetailView, ListingListView, UserListingsView

urlpatterns = [
    path("listing/", ListingListView.as_view()), # public
    path("listing/create/", ListingCreateView.as_view(), name="listing-create"), # privé
    path("listing/<uuid:listing_id>/", ListingDetailView.as_view(), name="listing-detail"),
    path("listing/me/", UserListingsView.as_view()),

    path("favorites/", FavoriteListView.as_view(), name="favorite-list"),
    path("favorites/<uuid:listing_id>/", FavoriteToggleView.as_view(), name="favorite-toggle"),
]
