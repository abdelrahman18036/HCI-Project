// src/app/components/events/event-list/event-list.component.ts

import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  userType: string | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userType = this.authService.getUserType();
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load events.';
        this.isLoading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
