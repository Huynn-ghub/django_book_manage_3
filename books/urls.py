
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from books import views

# Router tự động tạo CRUD routes cho BookViewSet
router = DefaultRouter()
router.register(r'books', views.BookViewSet, basename='book')

urlpatterns = [
    # JWT Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('', include(router.urls)),
    path('home', views.home, name='home'),
]
