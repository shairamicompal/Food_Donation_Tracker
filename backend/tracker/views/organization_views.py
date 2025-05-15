from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from tracker.models import UserProfile

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def organization_list(request):
    organizations = UserProfile.objects.filter(role='organization')
    data = [
        {
            "id": org.user.id,
            "name": f"{org.user.first_name} {org.user.last_name}",
            "address": org.address
        }
        for org in organizations
    ]
    return Response(data)
