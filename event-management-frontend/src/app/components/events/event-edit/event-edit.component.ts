// src/app/components/events/event-edit/event-edit.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css'],
})
export class EventEditComponent implements OnInit {
  eventForm!: FormGroup;
  eventId!: number;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Variables to hold selected files
  selectedPromotionalImage: File | null = null;
  selectedPromotionalVideo: File | null = null;

  // Existing media URLs
  existingPromotionalImage: string | null = null;
  existingPromotionalVideo: string | null = null;

  // Ticket Types
  ticketTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.fetchTicketTypes();
    this.loadEvent();
  }

  initializeForm(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      ticket_price: [0, [Validators.required, Validators.min(0)]],
      is_promotion: [false],
      tickets: this.fb.array([this.createTicketGroup()], Validators.required), // Renamed and defined as FormArray
    });
  }

  get tickets(): FormArray {
    return this.eventForm.get('tickets') as FormArray; // Now correctly accessing 'tickets'
  }

  createTicketGroup(): FormGroup {
    return this.fb.group({
      ticket_type: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
    });
  }

  addTicket(): void {
    this.tickets.push(this.createTicketGroup());
  }

  removeTicket(index: number): void {
    if (this.tickets.length > 1) {
      this.tickets.removeAt(index);
    }
  }

  loadEvent(): void {
    this.isLoading = true;
    this.eventService.getEvent(this.eventId).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          category: event.category,
          ticket_price: event.ticket_price,
          is_promotion: event.is_promotion,
        });

        // Existing media
        this.existingPromotionalImage = event.promotional_image;
        this.existingPromotionalVideo = event.promotional_video;

        // Populate tickets
        this.tickets.clear();
        event.tickets.forEach((ticket: any) => {
          this.tickets.push(
            this.fb.group({
              ticket_type: ticket.ticket_type, // TicketType ID
              price: [ticket.price, [Validators.required, Validators.min(0)]],
              quantity: [
                ticket.quantity,
                [Validators.required, Validators.min(1)],
              ],
            })
          );
        });

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load event details.';
        this.isLoading = false;
      },
    });
  }

  onPromotionalImageChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.selectedPromotionalImage = event.target.files[0];
    }
  }

  onPromotionalVideoChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.selectedPromotionalVideo = event.target.files[0];
    }
  }

  fetchTicketTypes(): void {
    this.eventService.getTicketTypes().subscribe({
      next: (types) => {
        this.ticketTypes = types;
      },
      error: (err) => {
        console.error('Failed to fetch ticket types.', err);
      },
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    this.isLoading = true;
    const eventData = this.eventForm.value;

    // Create FormData
    const formData = new FormData();

    // Append simple fields
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('date', eventData.date);
    formData.append('time', eventData.time);
    formData.append('location', eventData.location);
    formData.append('category', eventData.category);
    formData.append('ticket_price', eventData.ticket_price.toString());
    formData.append('is_promotion', eventData.is_promotion.toString());

    // Append files if selected
    if (this.selectedPromotionalImage) {
      formData.append('promotional_image', this.selectedPromotionalImage);
    }

    if (this.selectedPromotionalVideo) {
      formData.append('promotional_video', this.selectedPromotionalVideo);
    }

    // Prepare tickets_data
    const ticketsData = eventData.tickets.map((ticket: any) => ({
      ticket_type: ticket.ticket_type,
      price: ticket.price,
      quantity: ticket.quantity,
    }));

    formData.append('tickets_data', JSON.stringify(ticketsData));

    this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: () => {
        this.successMessage = 'Event updated successfully.';
        this.errorMessage = '';
        this.isLoading = false;
        this.router.navigate(['/organizer']);
      },
      error: (err) => {
        if (err.error) {
          this.errorMessage = JSON.stringify(err.error);
        } else {
          this.errorMessage = 'Failed to update event.';
        }
        this.successMessage = '';
        this.isLoading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/events']);
  }
}
