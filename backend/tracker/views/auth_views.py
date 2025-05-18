
# from rest_framework import generics, permissions
# from rest_framework.response import Response
# from rest_framework.authtoken.models import Token
# from django.contrib.auth.models import User
# from tracker.serializers.user_serializer import RegisterSerializer, UserSerializer
# from rest_framework.views import APIView
# from rest_framework.authtoken.views import ObtainAuthToken
# from tracker.models import UserProfile


# class RegisterAPI(generics.GenericAPIView):
#     serializer_class = RegisterSerializer  # ✅ Required to avoid AssertionError

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
#         token = Token.objects.create(user=user)
#         profile = UserProfile.objects.get(user=user)

#         return Response({
#             "token": token.key,
#             "user": UserSerializer(user).data,
#             "role": profile.role,
#             "address": profile.address,
#             "birthday": profile.birthday
#         })

#     def get(self, request, *args, **kwargs):  # ✅ Gracefully reject GET
#         return Response({"detail": "GET method not allowed."}, status=405)


# class LoginAPI(ObtainAuthToken):
#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)
#         token = response.data['token']
#         user = Token.objects.get(key=token).user
#         profile = UserProfile.objects.get(user=user)

#         return Response({
#             "token": token,
#             "user": UserSerializer(user).data,
#             "role": profile.role,
#             "address": profile.address,
#             "birthday": profile.birthday
#         })


# class UserAPI(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):
#         profile = UserProfile.objects.get(user=request.user)

#         return Response({
#             "user": UserSerializer(request.user).data,
#             "role": profile.role,
#             "address": profile.address,
#             "birthday": profile.birthday
#         })

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from tracker.serializers.user_serializer import RegisterSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from tracker.models import UserProfile
from django.contrib.auth import authenticate


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer  # ✅ Required to avoid AssertionError

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = Token.objects.create(user=user)
        profile = UserProfile.objects.get(user=user)

        return Response({
            "token": token.key,
            "user": UserSerializer(user).data,
            "role": profile.role,
            "address": profile.address,
            "birthday": profile.birthday
        })

    def get(self, request, *args, **kwargs):  # ✅ Gracefully reject GET
        return Response({"detail": "GET method not allowed."}, status=405)


class LoginAPI(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        identifier = request.data.get('username')  # can be username or email
        password = request.data.get('password')

        if not identifier or not password:
            return Response({'detail': 'Please provide both username/email and password.'}, status=400)

        # Try to authenticate with email
        try:
            user_obj = User.objects.get(email=identifier)
            username = user_obj.username
        except User.DoesNotExist:
            username = identifier  # fallback to assuming it's a username

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'detail': 'Invalid credentials.'}, status=400)

        token, _ = Token.objects.get_or_create(user=user)
        profile = UserProfile.objects.get(user=user)

        return Response({
            "token": token.key,
            "user": UserSerializer(user).data,
            "role": profile.role,
            "address": profile.address,
            "birthday": profile.birthday
        })


class UserAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)

        return Response({
            "user": UserSerializer(request.user).data,
            "role": profile.role,
            "address": profile.address,
            "birthday": profile.birthday
        })
