// src/app/components/events/event-create/event-create.component.ts

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
})
export class EventCreateComponent implements OnInit {
  eventForm!: FormGroup;
  isEditing: boolean = false;
  eventId!: number;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Variables to hold selected files
  selectedPromotionalImage: File | null = null;
  selectedPromotionalVideo: File | null = null;

  // Variables to hold existing image/video URLs
  existingPromotionalImage: string | null = null;
  existingPromotionalVideo: string | null = null;

  // Ticket Types fetched from backend
  ticketTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchTicketTypes(); // Fetch ticket types on init
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.eventId = Number(idParam);
      this.isEditing = true;
      this.loadEvent();
    }
  }

  private initializeForm(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      ticket_price: [0, [Validators.required, Validators.min(0)]],
      is_promotion: [false],
      tickets: this.fb.array([this.createTicketGroup()]),
    });
  }

  private createTicketGroup(): FormGroup {
    return this.fb.group({
      ticket_type_id: [null, Validators.required], // Must be set to a valid TicketType ID
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
    });
  }

  get tickets(): FormArray {
    return this.eventForm.get('tickets') as FormArray;
  }

  addTicket(): void {
    this.tickets.push(this.createTicketGroup());
  }

  removeTicket(index: number): void {
    if (this.tickets.length > 1) {
      this.tickets.removeAt(index);
    }
  }

  private loadEvent(): void {
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

        // Store existing promotional image and video URLs
        this.existingPromotionalImage = event.promotional_image;
        this.existingPromotionalVideo = event.promotional_video;

        // Clear existing tickets and set fetched tickets
        this.tickets.clear();
        event.tickets.forEach((ticket: any) => {
          this.tickets.push(
            this.fb.group({
              ticket_type_id: ticket.ticket_type_id, // Ensure backend sends 'ticket_type_id'
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

  private fetchTicketTypes(): void {
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
    console.log('Submitting Form:', this.eventForm.value);

    if (this.eventForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    this.isLoading = true;
    const eventData = this.eventForm.value;
    console.log('Form Valid:', this.eventForm.valid);

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
      ticket_type_id: ticket.ticket_type_id,
      price: ticket.price,
      quantity: ticket.quantity,
    }));

    // Append tickets as JSON string
    formData.append('tickets_data', JSON.stringify(ticketsData));

    console.log('Submitting Tickets:', ticketsData);

    if (this.isEditing) {
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
    } else {
      this.eventService.createEvent(formData).subscribe({
        next: (createdEvent) => {
          this.successMessage = 'Event created successfully.';
          this.errorMessage = '';
          this.isLoading = false;
          this.router.navigate(['/organizer']);
        },
        error: (err) => {
          if (err.error) {
            this.errorMessage = JSON.stringify(err.error);
          } else {
            this.errorMessage = 'Failed to create event.';
          }
          this.successMessage = '';
          this.isLoading = false;
        },
      });
    }
  }
}
