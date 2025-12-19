from django.urls import path
from .views import GoogleAuthView, RegisterView, MeView
from .tokens import EmailTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('auth/google/', GoogleAuthView.as_view(), name='auth_google'),
]