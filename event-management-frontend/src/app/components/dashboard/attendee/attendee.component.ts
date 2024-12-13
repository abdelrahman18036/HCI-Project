// src/app/components/dashboard/attendee/attendee.component.ts

import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../services/registration.service';
import { AuthService } from '../../../services/auth.service';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  // Add other relevant fields
}

interface Ticket {
  id: number;
  ticket_type: string;
  // Add other relevant fields
}

interface Registration {
  attendee: number;
  event: Event;
  ticket: Ticket;
  registered_at: string;
}

@Component({
  selector: 'app-attendee',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
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
        this.registrations = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load your registrations.';
        this.isLoading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
