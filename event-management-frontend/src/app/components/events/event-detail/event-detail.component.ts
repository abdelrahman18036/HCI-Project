// src/app/components/events/event-detail/event-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  event: any;
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const eventIdParam = this.route.snapshot.paramMap.get('id');
    const eventId = eventIdParam ? +eventIdParam : null;

    if (eventId !== null) {
      this.eventService.getEvent(eventId).subscribe({
        next: (data: any) => {
          this.event = data;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.error = 'Error fetching event details.';
          this.isLoading = false;
        },
      });
    } else {
      this.error = 'No event ID provided.';
      this.isLoading = false;
    }
  }
}
