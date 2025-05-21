from rest_framework import serializers
from tracker.models import Donation, UserProfile
from django.contrib.auth.models import User

# Serializer for organization details
class OrganizationSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['name', 'address']
    
    def get_name(self, obj):
        return obj.user.first_name or obj.user.username

# Serializer for donor details
class DonorDetailsSerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'address']

    def get_address(self, obj):
        try:
            return obj.userprofile.address
        except UserProfile.DoesNotExist:
            return None
        
class DonationSerializer(serializers.ModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(userprofile__role='organization'),
        required=False,
        allow_null=True
    )
    organization_details = serializers.SerializerMethodField(read_only=True)
    donor_details = DonorDetailsSerializer(source='donor', read_only=True)
    
    class Meta:
        model = Donation
        fields = '__all__'
        read_only_fields = ['donor', 'created_at']

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
