from django.shortcuts import render

from django.contrib.auth.models import User
from .serializers import UserSerializer,ProfileSerializer
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Profile

@api_view(['GET'])
def user_list(request):
    user=User.objects.all()
    serailizer=UserSerializer(user,many=True)
    return Response(serailizer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    print(request.user)  

    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProfileSerializer(profile)
    return Response(serializer.data, status=status.HTTP_200_OK)

   
    