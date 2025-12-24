from django.contrib import admin
from .models import Listing


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'owner', 'country_label', 'city_name', 'price', 'created_at']
    list_filter = ("country_label",)
    search_fields = ['country_label', 'title']
