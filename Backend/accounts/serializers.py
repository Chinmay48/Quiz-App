from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','first_name', 'last_name']
        
        
class ProfileSerializer(serializers.ModelSerializer):
    user=UserSerializer()
    class Meta:
        model=Profile
        fields=['user','role', 'department', 'year']
        
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES)
    department = serializers.ChoiceField(choices=Profile.DEPARTMENT_CHOICES)
    year = serializers.ChoiceField(
        choices=Profile.YEAR_CHOICES, 
        required=False,
        allow_null=True,
        allow_blank=True
    )

    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username", "email", "first_name", "last_name",
            "password", "confirm_password",
            "role", "department", "year"
        ]

    def validate(self, data):
        # Check password match
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")

        # Year required only for student
        if data["role"] == "student" and not data.get("year"):
            raise serializers.ValidationError("Year is required for student role")

        return data

    def create(self, validated_data):
        role = validated_data.pop("role")
        department = validated_data.pop("department")
        year = validated_data.pop("year", None)
        validated_data.pop("confirm_password")

        password = validated_data.pop("password")

        # Create User
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        # Create Profile
        Profile.objects.create(
            user=user,
            role=role,
            department=department,
            year=year if role == "student" else None
        )

        return user
