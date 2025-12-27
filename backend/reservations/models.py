from django.conf import settings
from django.db import models
from listing.models import Listing  # adapte l'import selon ton projet

class Reservation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='reservations')
    startDate = models.DateField()
    endDate = models.DateField()
    totalPrice = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.listing.title} ({self.startDate} → {self.endDate})"
