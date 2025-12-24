import uuid
from django.db import models
from django.contrib.auth import get_user_model

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
    lat = models.FloatField()
    lng = models.FloatField()

    # City (optional)
    city_name = models.CharField(max_length=255, null=True, blank=True)
    city_lat = models.FloatField(null=True, blank=True)
    city_lng = models.FloatField(null=True, blank=True)

    guest_count = models.IntegerField()
    room_count = models.IntegerField()
    bathroom_count = models.IntegerField()

    images = models.JSONField(default=list)

    price = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
