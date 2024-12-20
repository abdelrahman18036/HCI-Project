# your_app/views.py

from rest_framework import generics, permissions, status
from .models import User, Event, Ticket, TicketType, Registration, Feedback, Comment
from .serializers import (
    AttendeeSerializer, CommentSerializer, OrganizerAnalyticsSerializer, UserSerializer, EventSerializer, 
    TicketSerializer, TicketTypeSerializer, RegistrationSerializer, FeedbackSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import BasePermission
from django.db.models import Count, Avg, Sum

# User Registration (unchanged)
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# User Login (unchanged)
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_type': user.user_type,
                'username': user.username,
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# TicketType List View
class TicketTypeListView(generics.ListAPIView):
    queryset = TicketType.objects.all()
    serializer_class = TicketTypeSerializer
    permission_classes = [permissions.AllowAny]  # Adjust as needed

# Event List and Create (unchanged except parser_classes)
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('-is_promotion', '-created_at')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Updated to include JSONParser

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    

# Event Retrieve, Update, Destroy (unchanged except parser_classes)
class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Updated to include JSONParser

    def perform_update(self, serializer):
        serializer.save()
    
    # add the count of registrations to the event object
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['registrations_count'] = instance.registrations.count()
        return Response(data)

# Ticket Views (unchanged)
class TicketListCreateView(generics.ListCreateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

class TicketRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

# Registration Views (unchanged)
class RegistrationListCreateView(generics.ListCreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(attendee=self.request.user)
# Feedback Views (unchanged)
class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(attendee=self.request.user)

# Organizer-specific Views (unchanged)
class IsOrganizerOrReadOnly(BasePermission):
    """
    Custom permission to only allow organizers to edit or delete their own events.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD, or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the organizer of the event.
        return obj.organizer == request.user

class OrganizerEventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user).annotate(
            registrations_count=Count('registrations')
        ).order_by('-is_promotion', '-created_at')
# User Profile View (unchanged)
class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# Event Attendees List View (unchanged)
class EventAttendeesListView(generics.ListAPIView):
    serializer_class = AttendeeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return User.objects.filter(registrations__event_id=event_id).distinct()

class FeedbackListCreateView(generics.ListCreateAPIView):
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return Feedback.objects.filter(event_id=event_id).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(attendee=self.request.user)

class AttendeeRegistrationListView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(attendee=self.request.user)


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return Comment.objects.filter(event_id=event_id).order_by('-created_at')

    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        serializer.save(attendee=self.request.user, event_id=event_id)

class OrganizerAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.user_type != 'organizer':
            return Response({"error": "Only organizers can access analytics."}, status=403)
        
        events = Event.objects.filter(organizer=user)
        total_events = events.count()
        total_registrations = Registration.objects.filter(event__organizer=user).count()
        total_feedback = Feedback.objects.filter(event__organizer=user).count()
        average_rating = Feedback.objects.filter(event__organizer=user).aggregate(Avg('rating'))['rating__avg'] or 0
        total_revenue = Registration.objects.filter(event__organizer=user).aggregate(
            revenue=Sum('ticket__price')
        )['revenue'] or 0.00

        # Detailed analytics per event
        events_data = []
        for event in events:
            registrations = Registration.objects.filter(event=event).count()
            feedback_count = Feedback.objects.filter(event=event).count()
            avg_rating = Feedback.objects.filter(event=event).aggregate(Avg('rating'))['rating__avg'] or 0
            revenue = Registration.objects.filter(event=event).aggregate(
                revenue=Sum('ticket__price')
            )['revenue'] or 0.00

            # Ticket sales breakdown
            tickets = Ticket.objects.filter(event=event).select_related('ticket_type')
            ticket_sales = []
            for ticket in tickets:
                ticket_sales.append({
                    'ticket_type': ticket.ticket_type.name,
                    'sold': ticket.sold
                })

            events_data.append({
                'event_id': event.id,
                'title': event.title,
                'total_registrations': registrations,
                'total_feedback': feedback_count,
                'average_rating': avg_rating,
                'ticket_sales': ticket_sales,
                'revenue': revenue
            })

        analytics = {
            'total_events': total_events,
            'total_registrations': total_registrations,
            'total_feedback': total_feedback,
            'average_rating': average_rating,
            'total_revenue': total_revenue,
            'events': events_data
        }

        serializer = OrganizerAnalyticsSerializer(analytics)
        return Response(serializer.data, status=200)