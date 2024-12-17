# your_app/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom User Model
class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('organizer', 'Organizer'),
        ('attendee', 'Attendee'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    profile_image = models.URLField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.username

# TicketType Model
class TicketType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# Event Model
class Event(models.Model):
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    ticket_price = models.DecimalField(max_digits=8, decimal_places=2)
    promotional_image = models.ImageField(upload_to='event_images/', null=True, blank=True)
    promotional_video = models.FileField(upload_to='event_videos/', null=True, blank=True)
    is_promotion = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class Feedback(models.Model):
    event = models.ForeignKey(Event, related_name='feedbacks', on_delete=models.CASCADE)
    attendee = models.ForeignKey(User, related_name='feedbacks', on_delete=models.CASCADE)
    comment = models.TextField()
    rating = models.PositiveIntegerField(default=5)  # Optional: Add a rating field
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Feedback by {self.attendee.username} on {self.event.title}'
# Ticket Model
class Ticket(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets')
    ticket_type = models.ForeignKey(TicketType, on_delete=models.CASCADE, related_name='tickets')
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField()
    sold = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.event.title} - {self.ticket_type.name}"

# Registration Model
class Registration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='registrations')  # Added 'ticket' field
    attendee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registrations')
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.attendee.username} - {self.event.title}"

class Comment(models.Model):
    event = models.ForeignKey(Event, related_name='comments', on_delete=models.CASCADE)
    attendee = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.attendee.username} on {self.event.title}'