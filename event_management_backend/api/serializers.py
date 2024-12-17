# your_app/serializers.py

from rest_framework import serializers
from .models import TicketType, User, Event, Ticket, Registration, Feedback
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
import json

User = get_user_model()

# User Serializer (unchanged)
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'password2', 'email', 'user_type', 'profile_image')
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

# TicketType Serializer (unchanged)
class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = ['id', 'name']

# Ticket Serializer (unchanged)
# your_app/serializers.py

class TicketSerializer(serializers.ModelSerializer):
    ticket_type = serializers.CharField(source='ticket_type.name', read_only=True)  # Added name

    class Meta:
        model = Ticket
        fields = ['id', 'ticket_type', 'price', 'quantity', 'sold']

# Event Serializer
class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.ReadOnlyField(source='organizer.username')
    tickets_data = serializers.CharField(write_only=True)  # Write-only field for creating/updating tickets
    tickets = TicketSerializer(many=True, read_only=True)  # Nested read-only serializer for tickets
    promotional_image = serializers.ImageField(required=False, allow_null=True)
    promotional_video = serializers.FileField(required=False, allow_null=True)
    registrations_count = serializers.IntegerField(read_only=True)  # New read-only field

    class Meta:
        model = Event
        fields = '__all__'

    def validate_tickets_data(self, value):
        """
        Validate that 'tickets_data' is a valid JSON list.
        """
        try:
            parsed = json.loads(value)
            if not isinstance(parsed, list):
                raise serializers.ValidationError("Tickets must be a list.")
            return parsed
        except json.JSONDecodeError:
            raise serializers.ValidationError("Invalid JSON format for 'tickets_data'.")

    def create(self, validated_data):
        tickets_data = validated_data.pop('tickets_data', [])

        event = Event.objects.create(**validated_data)

        for ticket_dict in tickets_data:
            # Validate each ticket with the TicketSerializer
            ticket_serializer = TicketSerializer(data=ticket_dict)
            ticket_serializer.is_valid(raise_exception=True)
            Ticket.objects.create(event=event, **ticket_serializer.validated_data)

        return event

    def update(self, instance, validated_data):
        tickets_data = validated_data.pop('tickets_data', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tickets_data is not None:
            # Clear existing tickets
            instance.tickets.all().delete()
            # Create new tickets
            for ticket_dict in tickets_data:
                ticket_serializer = TicketSerializer(data=ticket_dict)
                ticket_serializer.is_valid(raise_exception=True)
                Ticket.objects.create(event=instance, **ticket_serializer.validated_data)

        return instance

# Feedback Serializer (unchanged)
class FeedbackSerializer(serializers.ModelSerializer):
    attendee = serializers.ReadOnlyField(source='attendee.username')

    class Meta:
        model = Feedback
        fields = '__all__'

# Attendee Serializer (unchanged)
class AttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

# Registration Serializer (unchanged)
class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['id', 'event', 'ticket', 'attendee']  # Added 'ticket'
        read_only_fields = ['attendee']