from rest_framework import serializers
from .models import User, Event, Ticket, Registration, Feedback
from django.contrib.auth.password_validation import validate_password

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'password2', 'email', 'user_type')
        extra_kwargs = {
            'email': {'required': True},
            'user_type': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            user_type=validated_data['user_type']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# Event Serializer
class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.ReadOnlyField(source='organizer.username')

    class Meta:
        model = Event
        fields = '__all__'

# Ticket Serializer
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

# Registration Serializer
class RegistrationSerializer(serializers.ModelSerializer):
    attendee = serializers.ReadOnlyField(source='attendee.username')

    class Meta:
        model = Registration
        fields = '__all__'

# Feedback Serializer
class FeedbackSerializer(serializers.ModelSerializer):
    attendee = serializers.ReadOnlyField(source='attendee.username')

    class Meta:
        model = Feedback
        fields = '__all__'
