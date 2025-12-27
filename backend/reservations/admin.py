from django.contrib import admin
from .models import Reservation


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'listing', 'start_date', 'end_date', 'total_price']
    search_fields = ['user__email', 'listing__title']
    list_filter = ("listing", )
