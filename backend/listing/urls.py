from django.urls import path
from .views import ListingCreateView

urlpatterns = [
    path("", ListingCreateView.as_view(), name="listing-create"),
]
