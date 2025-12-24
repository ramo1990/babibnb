import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal


User = get_user_model()

class Listing(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")

    title = models.CharField(max_length=255)
    description = models.TextField()

    categories = models.JSONField(default=list)

    # Location (obligatoire)
    country_label = models.CharField(max_length=255)
    country_code = models.CharField(max_length=10)
    country_flag = models.CharField(max_length=10)
    country_region = models.CharField(max_length=255)
    country_lat = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)]) # compris entre -90 et90
    country_lng = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)]) # compris entre -180 et180

    # City (optional)
    city_name = models.CharField(max_length=255, null=True, blank=True)
    city_lat = models.FloatField(null=True, blank=True,validators=[MinValueValidator(-90), MaxValueValidator(90)]) # compris entre -90 et90
    city_lng = models.FloatField(null=True, blank=True,validators=[MinValueValidator(-180), MaxValueValidator(180)]) # compris entre -180 et180

    # Doit etre au moins = 1
    guest_count = models.IntegerField(validators=[MinValueValidator(1)])
    room_count = models.IntegerField(validators=[MinValueValidator(1)])
    bathroom_count = models.IntegerField(validators=[MinValueValidator(1)])

    images = models.JSONField(default=list)

    # Prix doit etre positif
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))])

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['owner', '-created_at']),  # User's listings by date
            models.Index(fields=['country_code', 'city_name']),  # Location filtering
            models.Index(fields=['price']),  # Price range queries
            models.Index(fields=['-created_at']),  # Recent listings
        ]

    def __str__(self):
        return self.title
