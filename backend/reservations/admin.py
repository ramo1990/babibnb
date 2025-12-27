from django.contrib import admin
from .models import Reservation


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'listing', 'start_date', 'end_date', 'total_price']
    list_filter = ("listing", )
