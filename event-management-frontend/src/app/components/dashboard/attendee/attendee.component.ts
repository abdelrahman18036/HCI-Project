// src/app/components/dashboard/attendee/attendee.component.ts

import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../services/registration.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Registration } from '../../../models/registration.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-attendee',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './attendee.component.html',
  styleUrls: ['./attendee.component.css'],
})
export class AttendeeComponent implements OnInit {
  registrations: Registration[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private registrationService: RegistrationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.isLoading = true;
    this.registrationService.getAttendeeRegistrations().subscribe({
      next: (data: Registration[]) => {
        console.log('Registrations fetched:', data);
        this.registrations = data.filter((reg) => reg.event_details);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching registrations:', err);
        this.errorMessage = 'Failed to load your registrations.';
        this.isLoading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  shareRegistration(registration: Registration): void {
    if (navigator.share) {
      navigator
        .share({
          title: registration.event_details?.title,
          text: `Join me at ${registration.event_details?.title} on ${registration.event_details?.date}!`,
          url:
            window.location.origin +
            `/events/${registration.event_details?.id}`,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      alert('Sharing is not supported in your browser.');
    }
  }
}
