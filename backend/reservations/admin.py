from django.contrib import admin
from .models import Reservation


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'listing', 'startDate', 'endDate', 'totalPrice']
    list_filter = ("listing", )
    search_fields = ['user', 'startDate']