from django.urls import path
from .views import ListingCreateView, ListingListView

urlpatterns = [
    path("", ListingListView.as_view()), # public
    path("create/", ListingCreateView.as_view(), name="listing-create"), # privé
]
