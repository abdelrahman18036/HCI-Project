from django.urls import path
from .views import (
    EventAttendeesListView, SignupView, LoginView,
    EventListCreateView, EventRetrieveUpdateDestroyView,
    TicketListCreateView, TicketRetrieveUpdateDestroyView,
    RegistrationListCreateView, FeedbackListCreateView,
    OrganizerEventListView, AttendeeRegistrationListView, UserProfileView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Authentication
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Events
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventRetrieveUpdateDestroyView.as_view(), name='event-detail'),

    # Tickets
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/', TicketRetrieveUpdateDestroyView.as_view(), name='ticket-detail'),

    # Registrations
    path('registrations/', RegistrationListCreateView.as_view(), name='registration-list-create'),

    # Feedback
    path('feedback/', FeedbackListCreateView.as_view(), name='feedback-list-create'),

    # Organizer-specific
    path('organizer/events/', OrganizerEventListView.as_view(), name='organizer-event-list'),

    # Attendee-specific
    path('attendee/registrations/', AttendeeRegistrationListView.as_view(), name='attendee-registration-list'),

    # User Profile
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('events/<int:event_id>/attendees/', EventAttendeesListView.as_view(), name='event-attendees-list'),  # New route

]
