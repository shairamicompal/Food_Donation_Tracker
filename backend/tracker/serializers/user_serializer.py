
# from django.contrib.auth.models import User
# from rest_framework import serializers
# from ..models import UserProfile  # Import the UserProfile model

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'first_name', 'last_name')


# class RegisterSerializer(serializers.ModelSerializer):
#     confirm_password = serializers.CharField(write_only=True)
#     role = serializers.ChoiceField(choices=['donor', 'organization'], write_only=True)
#     first_name = serializers.CharField(required=True)
#     last_name = serializers.CharField(required=True)
#     address = serializers.CharField(write_only=True, required=False, allow_blank=True)
#     birthday = serializers.DateField(write_only=True, required=False)

#     class Meta:
#         model = User
#         fields = (
#             'id', 'username', 'email', 'password', 'confirm_password',
#             'role', 'first_name', 'last_name', 'address', 'birthday'
#         )
#         extra_kwargs = {'password': {'write_only': True}}

#     def validate(self, data):
#         if data['password'] != data['confirm_password']:
#             raise serializers.ValidationError({"password": "Passwords must match."})
#         return data

#     def create(self, validated_data):
#         validated_data.pop('confirm_password')
#         role = validated_data.pop('role')
#         address = validated_data.pop('address', '')
#         birthday = validated_data.pop('birthday', None)

#         user = User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=validated_data['password'],
#             first_name=validated_data['first_name'],
#             last_name=validated_data['last_name']
#         )

#         UserProfile.objects.create(
#             user=user,
#             role=role,
#             address=address,
#             birthday=birthday
#         )

#         return user

from django.contrib.auth.models import User
from rest_framework import serializers
from ..models import UserProfile  # Import the UserProfile model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=['donor', 'organization'], write_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(write_only=True, required=False, allow_blank=True)
    birthday = serializers.DateField(write_only=True, required=False)
    

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'confirm_password',
            'role', 'first_name', 'last_name', 'address', 'birthday'
        )
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords must match."})

        role = data.get('role')
        
        if role == 'donor':
            if not data.get('first_name') or not data.get('last_name') or not data.get('birthday'):
                raise serializers.ValidationError({
                    "detail": "Donors must provide first name, last name, and birthday."
                })
        elif role == 'organization':
            if not data.get('first_name'):
                raise serializers.ValidationError({
                    "detail": "Organizations must provide an organization name."
                })
        
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        role = validated_data.pop('role')
        address = validated_data.pop('address', '')
        birthday = validated_data.pop('birthday', None)

        # For organization users, last_name can be blank
        first_name = validated_data.get('first_name', '')
        last_name = validated_data.get('last_name', '') or ''

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name
        )

        UserProfile.objects.create(
            user=user,
            role=role,
            address=address,
            birthday=birthday  # can be None for organizations
        )

        return user
