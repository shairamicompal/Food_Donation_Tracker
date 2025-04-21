from django.urls import path
from .views import auth_views
from django.http import HttpResponse

urlpatterns = [
    path('', lambda request: HttpResponse("Welcome to the Django API Server 👋")),
    path('api/register/', auth_views.RegisterAPI.as_view(), name='register'),
    path('api/login/', auth_views.LoginAPI.as_view(), name='login'),
    path('api/user/', auth_views.UserAPI.as_view(), name='user'),
]
