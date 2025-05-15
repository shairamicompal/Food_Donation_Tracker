# from rest_framework import serializers
# from tracker.models import Donation, UserProfile

# class DonationSerializer(serializers.ModelSerializer):
#     organization = serializers.SerializerMethodField()

#     class Meta:
#         model = Donation
#         fields = '__all__'
#         read_only_fields = ['donor', 'created_at', 'accepted']

#     def get_organization(self, obj):
#         org_user = obj.organization
#         if org_user is None:
#             return None
#         try:
#             profile = UserProfile.objects.get(user=org_user)
#             return {
#                 "id": org_user.id,
#                 "name": f"{org_user.first_name} {org_user.last_name}".strip() or org_user.username,
#                 "address": profile.address or ""
#             }
#         except UserProfile.DoesNotExist:
#             return {
#                 "id": org_user.id,
#                 "name": f"{org_user.first_name} {org_user.last_name}".strip() or org_user.username,
#                 "address": ""
#             }

# tracker/serializers/donation_serializer.py

# from rest_framework import serializers
# from tracker.models import Donation, UserProfile
# from django.contrib.auth.models import User

# class OrganizationSerializer(serializers.ModelSerializer):
#     name = serializers.SerializerMethodField()
    
#     class Meta:
#         model = UserProfile
#         fields = ['name', 'address']
    
#     def get_name(self, obj):
#         return obj.user.first_name or obj.user.username

# class DonationSerializer(serializers.ModelSerializer):
#     # Allow sending organization ID in POST
#     organization = serializers.PrimaryKeyRelatedField(
#         queryset=User.objects.filter(userprofile__role='organization'),
#         required=False,
#         allow_null=True
#     )

#     # Optional: return detailed org info in GET
#     organization_details = serializers.SerializerMethodField(read_only=True)

#     class Meta:
#         model = Donation
#         fields = '__all__'
#         read_only_fields = ['donor', 'created_at', 'accepted']

#     def get_organization_details(self, obj):
#         if obj.organization:
#             try:
#                 profile = UserProfile.objects.get(user=obj.organization)
#                 return OrganizationSerializer(profile).data
#             except UserProfile.DoesNotExist:
#                 return None
#         return None

from rest_framework import serializers
from tracker.models import Donation, UserProfile
from django.contrib.auth.models import User

class OrganizationSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['name', 'address']
    
    def get_name(self, obj):
        return obj.user.first_name or obj.user.username

class DonationSerializer(serializers.ModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(userprofile__role='organization'),
        required=False,
        allow_null=True
    )
    organization_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Donation
        fields = '__all__'
        read_only_fields = ['donor', 'created_at', 'accepted']

    def get_organization_details(self, obj):
        if obj.organization:
            try:
                profile = UserProfile.objects.get(user=obj.organization)
                return OrganizationSerializer(profile).data
            except UserProfile.DoesNotExist:
                return None
        return None

    def validate(self, data):
        donation_type = data.get('donation_type')

        if donation_type == 'donate':
            if not data.get('organization'):
                raise serializers.ValidationError({"organization": "This field is required for donations."})
            if not data.get('expiration_date'):
                raise serializers.ValidationError({"expiration_date": "This field is required for donations."})
            if not data.get('pickup_option'):
                raise serializers.ValidationError({"pickup_option": "This field is required for donations."})

        return data
