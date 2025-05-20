from django.urls import path
from .views import auth_views
from django.http import HttpResponse
from tracker.views.donation_views import (
    DonationCreateAPI,
    MyDonationsListAPI,
    DonationUpdateAPI,
    DonationDeleteAPI,
    ReceivedDonationsListAPI,  # if you want to add this later
)
from tracker.views import organization_views
from tracker.views.donation_views import update_donation_status  # <-- import your patch view here

from tracker.views.donation_views import (
    my_donation_count,
    my_waste_count,
    organization_dashboard_stats,
)



urlpatterns = [
    path('', lambda request: HttpResponse("Welcome to the Django API Server 👋")),
    path('api/register/', auth_views.RegisterAPI.as_view(), name='register'),
    path('api/login/', auth_views.LoginAPI.as_view(), name='login'),
    path('api/user/', auth_views.UserAPI.as_view(), name='user'),
    
    # Donation endpoints
    path('api/donations/', DonationCreateAPI.as_view(), name='donation-create'),
    path('api/donations/mine/', MyDonationsListAPI.as_view(), name='my-donations'),
    path('api/donations/<int:pk>/update/', DonationUpdateAPI.as_view(), name='donation-update'),
    path('api/donations/<int:pk>/delete/', DonationDeleteAPI.as_view(), name='donation-delete'),

    # Add the patch endpoint for updating status
    path('api/donations/<int:pk>/update-status/', update_donation_status, name='update-donation-status'),

    # Organizations
    path('api/organizations/', organization_views.organization_list, name='organization-list'),
    
    path('api/donations/received/', ReceivedDonationsListAPI.as_view(), name='received-donations'),
    
    #donor dashboard counts
    # Donor dashboard counts
    path('api/donations/my-count/', my_donation_count),
    path('api/waste/my-count/', my_waste_count),
    path('api/donations/org-stats/', organization_dashboard_stats, name='organization-dashboard-stats'),

]
