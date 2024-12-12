// src/app/components/events/event-create/event-create.component.ts

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { EventService } from '../../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
})
export class EventCreateComponent implements OnInit {
  eventForm!: FormGroup;
  promotional_image!: File;
  promotional_video!: File;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required],
      ticket_price: ['', Validators.required],
      promotional_image: [null],
      promotional_video: [null],
    });
  }

  onFileChange(event: any, field: string): void {
    if (field === 'promotional_image') {
      this.promotional_image = event.target.files[0];
    } else if (field === 'promotional_video') {
      this.promotional_video = event.target.files[0];
    }
  }

  onSubmit(): void {
    const formData = {
      ...this.eventForm.value,
      promotional_image: this.promotional_image,
      promotional_video: this.promotional_video,
    };
    this.eventService.createEvent(formData).subscribe({
      next: () => {
        this.router.navigate(['/events']);
      },
    });
  }
}
