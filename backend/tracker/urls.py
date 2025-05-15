from django.urls import path
from .views import auth_views
from django.http import HttpResponse
from tracker.views.donation_views import (
    DonationCreateAPI,
    MyDonationsListAPI,
    DonationUpdateAPI,
    DonationDeleteAPI,
)

from tracker.views import organization_views

urlpatterns = [
    path('', lambda request: HttpResponse("Welcome to the Django API Server 👋")),
    path('api/register/', auth_views.RegisterAPI.as_view(), name='register'),
    path('api/login/', auth_views.LoginAPI.as_view(), name='login'),
    path('api/user/', auth_views.UserAPI.as_view(), name='user'),
    path('api/donations/', DonationCreateAPI.as_view(), name='donation-create'),
    path('api/donations/mine/', MyDonationsListAPI.as_view(), name='my-donations'),
    # add update and delete URLs
    path('api/donations/<int:pk>/update/', DonationUpdateAPI.as_view(), name='donation-update'),
    path('api/donations/<int:pk>/delete/', DonationDeleteAPI.as_view(), name='donation-delete'),
     path('api/organizations/', organization_views.organization_list, name='organization-list'),
]
