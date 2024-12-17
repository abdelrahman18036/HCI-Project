from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Event, Ticket, Registration, Feedback, TicketType

class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('User Type', {'fields': ('user_type',)}),
    )

admin.site.register(User, UserAdmin)
admin.site.register(Event)
admin.site.register(Ticket)
admin.site.register(Registration)
admin.site.register(TicketType)
admin.site.register(Feedback)
