from rest_framework import serializers
from .models import Listing

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = "__all__"
        read_only_fields = ["owner", "created_at"]

    # def create(self, validated_data):
    #     return Listing.objects.create(**validated_data)

# Serializers personnalisé
class CreateListingSerializer(serializers.Serializer):
    # Champs simples
    title = serializers.CharField()
    description = serializers.CharField()
    categories = serializers.ListField(child=serializers.CharField())

    # Champs géographiques
    location = serializers.DictField()
    city = serializers.DictField(allow_null=True)
    
    # Compteurs
    guestCount = serializers.IntegerField()
    roomCount = serializers.IntegerField()
    bathroomCount = serializers.IntegerField()

    images = serializers.ListField(child=serializers.URLField())

    price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def create(self, validated_data):
        user = self.context["request"].user

        location = validated_data.pop("location")
        city = validated_data.pop("city")

        return Listing.objects.create(
            owner=user,
            title=validated_data["title"],
            description=validated_data["description"],
            categories=validated_data["categories"],

            country_label=location["label"],
            country_code=location["value"],
            country_flag=location["flag"],
            country_region=location["region"],
            country_lat=location["latlng"][0],
            country_lng=location["latlng"][1],

            city_name=city["name"] if city else None,
            city_lat=city["latlng"][0] if city else None,
            city_lng=city["latlng"][1] if city else None,

            guest_count=validated_data["guestCount"],
            room_count=validated_data["roomCount"],
            bathroom_count=validated_data["bathroomCount"],

            images=validated_data["images"],
            price=validated_data["price"],
        )
