from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('listing.urls')),
    path('api/', include('reservations.urls')),
    path('api/', include('chat.urls')),
]
