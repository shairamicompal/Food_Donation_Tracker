from rest_framework import generics, permissions, status as drf_status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
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

# class DonationUpdateAPI(generics.UpdateAPIView):
#     serializer_class = DonationSerializer
#     permission_classes = [permissions.IsAuthenticated]
#     lookup_field = 'pk'

#     def get_queryset(self):
#         return Donation.objects.filter(donor=self.request.user)

class DonationUpdateAPI(generics.UpdateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Donation.objects.filter(donor=self.request.user)

    def update(self, request, *args, **kwargs):
        donation = self.get_object()
        if donation.status != 'pending':
            return Response({'detail': 'You cannot update a donation once it has been accepted or declined.'},
                            status=drf_status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)


# class DonationDeleteAPI(generics.DestroyAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     lookup_field = 'pk'

#     def get_queryset(self):
#         return Donation.objects.filter(donor=self.request.user)

class DonationDeleteAPI(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Donation.objects.filter(donor=self.request.user)

    def destroy(self, request, *args, **kwargs):
        donation = self.get_object()
        if donation.status not in ['pending', 'declined']:
            return Response({'detail': 'You cannot delete a donation once it has been accepted or declined.'},
                            status=drf_status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)


class ReceivedDonationsListAPI(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Donation.objects.filter(organization=self.request.user).order_by('-created_at')
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            status_list = status_filter.split(',')
            qs = qs.filter(status__in=status_list)
        
        return qs

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_donation_status(request, pk):
    if request.user.userprofile.role != 'organization':
        return Response({"detail": "Permission denied."}, status=drf_status.HTTP_403_FORBIDDEN)
    try:
        donation = Donation.objects.get(pk=pk, organization=request.user)
    except Donation.DoesNotExist:
        return Response({"detail": "Donation not found or not assigned to you."}, status=drf_status.HTTP_404_NOT_FOUND)

    status_choice = request.data.get('status')
    if status_choice not in ['pending', 'accepted', 'declined']:
        return Response({"detail": "Invalid status choice."}, status=drf_status.HTTP_400_BAD_REQUEST)

    donation.status = status_choice
    donation.save()

    serializer = DonationSerializer(donation)
    return Response(serializer.data)


# ✅ Filter to only count actual donations (exclude waste)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_donation_count(request):
    user = request.user
    total = Donation.objects.filter(donor=user, donation_type='donate').count()
    return Response({'total': total})

# ✅ Count only waste donations
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_waste_count(request):
    user = request.user
    total_waste = Donation.objects.filter(donor=user, donation_type='waste').count()
    return Response({'total_waste': total_waste})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def organization_dashboard_stats(request):
    # Check if user is an organization
    if request.user.userprofile.role != 'organization':
        return Response({'detail': 'Only organizations can access this endpoint.'},
                        status=drf_status.HTTP_403_FORBIDDEN)

    org_user = request.user

    total = Donation.objects.filter(organization=org_user).count()
    pending = Donation.objects.filter(organization=org_user, status='pending').count()
    accepted = Donation.objects.filter(organization=org_user, status='accepted').count()
    declined = Donation.objects.filter(organization=org_user, status='declined').count()

    data = {
        'total': total,
        'pending': pending,
        'accepted': accepted,
        'declined': declined,
    }

    return Response(data)