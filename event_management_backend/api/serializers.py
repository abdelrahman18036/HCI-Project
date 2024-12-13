# your_app/serializers.py

from rest_framework import serializers
from .models import User, Event, Ticket, Registration, Feedback
from django.contrib.auth.password_validation import validate_password

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'password2', 'email', 'user_type')
        extra_kwargs = {
            'email': {'required': True},
            'user_type': {'required': True},
        }

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')

        if password or password2:
            if password != password2:
                raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('password2', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

    def create(self, validated_data):
        validated_data.pop('password2', None)
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

# Ticket Serializer
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

# Event Serializer
class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.ReadOnlyField(source='organizer.username')
    tickets = TicketSerializer(many=True, read_only=True)
    attendees = serializers.SerializerMethodField()  # New field

    class Meta:
        model = Event
        fields = '__all__'
    
    def get_attendees(self, obj):
        registrations = Registration.objects.filter(event=obj)
        attendees = [registration.attendee for registration in registrations]
        return AttendeeSerializer(attendees, many=True).data

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


class AttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']