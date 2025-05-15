# from rest_framework import generics, permissions
# from tracker.models import Donation
# from tracker.serializers.donation_serializer import DonationSerializer

# # You already have this
# class DonationCreateAPI(generics.CreateAPIView):
#     serializer_class = DonationSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(donor=self.request.user)

# # ➡️ ADD THIS
# class MyDonationsListAPI(generics.ListAPIView):
#     serializer_class = DonationSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Donation.objects.filter(donor=self.request.user).order_by('-created_at')

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from tracker.models import Donation
from tracker.serializers.donation_serializer import DonationSerializer

class DonationCreateAPI(generics.CreateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

class MyDonationsListAPI(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Donation.objects.filter(donor=self.request.user).order_by('-created_at')

# New update view
class DonationUpdateAPI(generics.UpdateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        # Ensure user can only update their own donations
        return Donation.objects.filter(donor=self.request.user)

# New delete view
class DonationDeleteAPI(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        # Ensure user can only delete their own donations
        return Donation.objects.filter(donor=self.request.user)
