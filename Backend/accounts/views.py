from django.shortcuts import render

from django.contrib.auth.models import User
from .serializers import UserSerializer,ProfileSerializer
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not old_password or not new_password:
        return Response({"error": "Both old_password and new_password are required."}, status=400)

    if not user.check_password(old_password):
        return Response({"error": "Incorrect current password."}, status=400)

  
    try:
        validate_password(new_password)  
    except ValidationError as e:
        return Response({"error": e.messages}, status=400)

    user.set_password(new_password)
    user.save()
    return Response({"message": "Password updated successfully."}, status=200)


   
