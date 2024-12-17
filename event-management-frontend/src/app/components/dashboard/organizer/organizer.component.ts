// src/app/components/organizer/organizer.component.ts

import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-organizer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css'],
})
export class OrganizerComponent implements OnInit {
  events: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrganizerEvents();
  }

  loadOrganizerEvents(): void {
    this.isLoading = true;
    this.eventService.getOrganizerEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load your events.';
        this.isLoading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  editEvent(eventId: number): void {
    this.router.navigate(['/events', eventId, 'edit']);
  }

  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          // Remove the deleted event from the events array
          this.events = this.events.filter((event) => event.id !== eventId);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete event.';
        },
      });
    }
  }
}
