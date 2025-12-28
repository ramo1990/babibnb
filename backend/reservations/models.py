import uuid
from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError
from listing.models import Listing  # adapte l'import selon ton projet


class Reservation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='reservations')
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['listing', 'start_date', 'end_date']),
        ]
    
    def clean(self):
        super().clean()
        if self.start_date and self.end_date and self.end_date <= self.start_date:
            raise ValidationError("End date must be after start date")
        
        # Check for overlapping reservations
        if self.listing_id:
            overlapping = Reservation.objects.filter(
                listing=self.listing,
                start_date__lt=self.end_date,
                end_date__gt=self.start_date
            ).exclude(pk=self.pk)
            
            if overlapping.exists():
                raise ValidationError("This listing is already reserved for the selected dates")
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.listing.title} ({self.start_date} → {self.end_date})"
