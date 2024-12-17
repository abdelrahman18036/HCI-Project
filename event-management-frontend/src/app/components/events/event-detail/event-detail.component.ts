// src/app/components/events/event-detail/event-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { RegistrationService } from '../../../services/registration.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EventFeedbackComponent } from '../event-feedback/event-feedback.component';
import { EventCommentsComponent } from '../event-comments/event-comments.component';
interface Ticket {
  id: number;
  ticket_type: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  ticket_price: number;
  promotional_image: string;
  promotional_video: string;
  tickets: Ticket[];
  registrations_count: number; // Ensure this is included in the serializer
  organizer: string;
}

interface RegistrationCreateData {
  event: number;
  ticket_id: number; // Updated field name
}

interface Profile {
  username: string;
  user_type: string;
  // ... other fields ...
}

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    EventFeedbackComponent,
    EventCommentsComponent,
  ],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  eventId!: number;
  userType: string | null = null;
  currentUsername: string | null = null;
  selectedTicketId: number | null = null;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private registrationService: RegistrationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.userType = this.authService.getUserType();
    this.loadProfile();
    this.loadEvent();
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (profile: Profile) => {
        this.currentUsername = profile.username;
      },
      error: (err: any) => {
        // handle error
      },
    });
  }

  loadEvent(): void {
    this.isLoading = true;
    this.eventService.getEvent(this.eventId).subscribe({
      next: (data: Event) => {
        this.event = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load event details.';
        this.isLoading = false;
      },
    });
  }
  bookEvent(): void {
    if (!this.userType || this.userType !== 'attendee') {
      this.errorMessage = 'Only attendees can book events.';
      return;
    }

    if (!this.selectedTicketId) {
      this.errorMessage = 'Please select a ticket type.';
      return;
    }

    const registrationData: RegistrationCreateData = {
      event: this.eventId,
      ticket_id: this.selectedTicketId, // Updated field name
    };

    this.registrationService.createRegistration(registrationData).subscribe({
      next: () => {
        this.successMessage = 'Event booked successfully.';
        this.errorMessage = '';
        if (this.event) {
          // Update sold count
          const bookedTicket = this.event.tickets.find(
            (t) => t.id === this.selectedTicketId
          );
          if (bookedTicket) {
            bookedTicket.sold += 1;
          }
          // Update registrations count
          this.event.registrations_count += 1;
        }
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to book event.';
        this.successMessage = '';
      },
    });
  }

  editEvent(): void {
    this.router.navigate(['/events', this.eventId, 'edit']);
  }

  deleteEvent(): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(this.eventId).subscribe({
        next: () => {
          this.router.navigate(['/organizer']);
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to delete event.';
        },
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
