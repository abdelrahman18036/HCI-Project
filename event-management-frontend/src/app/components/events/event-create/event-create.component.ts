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

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventId) {
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
      promotional_image: [''],
      promotional_video: [''],
      is_promotion: [false],
      tickets: this.fb.array([this.createTicketGroup()]),
    });
  }

  private createTicketGroup(): FormGroup {
    return this.fb.group({
      ticket_type: ['', Validators.required],
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
          promotional_image: event.promotional_image,
          promotional_video: event.promotional_video,
          is_promotion: event.is_promotion,
        });

        // Clear existing tickets and set fetched tickets
        this.tickets.clear();
        event.tickets.forEach((ticket: any) => {
          this.tickets.push(
            this.fb.group({
              ticket_type: [ticket.ticket_type, Validators.required],
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

  onSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }

    this.isLoading = true;
    const eventData = this.eventForm.value;

    // Separate tickets from event data
    const tickets = eventData.tickets;
    delete eventData.tickets;

    if (this.isEditing) {
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: () => {
          // Optionally, update tickets here
          // For simplicity, assuming backend handles ticket updates via nested serializers
          this.successMessage = 'Event updated successfully.';
          this.errorMessage = '';
          this.isLoading = false;
          this.router.navigate(['/organizer']);
        },
        error: (err) => {
          this.errorMessage = 'Failed to update event.';
          this.successMessage = '';
          this.isLoading = false;
        },
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: (createdEvent) => {
          // Create tickets for the newly created event
          tickets.forEach((ticket: any) => {
            this.eventService.createTicket(createdEvent.id, ticket).subscribe({
              next: () => {},
              error: () => {},
            });
          });
          this.successMessage = 'Event created successfully.';
          this.errorMessage = '';
          this.isLoading = false;
          this.router.navigate(['/organizer']);
        },
        error: (err) => {
          this.errorMessage = 'Failed to create event.';
          this.successMessage = '';
          this.isLoading = false;
        },
      });
    }
  }
}
