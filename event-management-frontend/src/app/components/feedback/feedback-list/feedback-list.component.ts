// src/app/components/feedback/feedback-list/feedback-list.component.ts

import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../../services/feedback.service';
import { EventService } from '../../../services/event.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css'],
})
export class FeedbackListComponent implements OnInit {
  feedbacks: any[] = [];
  events: any[] = [];
  feedbackForm!: FormGroup;

  constructor(
    private feedbackService: FeedbackService,
    private eventService: EventService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.feedbackService.getFeedbacks().subscribe({
      next: (data) => {
        this.feedbacks = data;
      },
    });

    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
    });

    this.feedbackForm = this.fb.group({
      event: ['', Validators.required],
      rating: ['', Validators.required],
      comments: [''],
    });
  }

  onSubmit(): void {
    this.feedbackService.createFeedback(this.feedbackForm.value).subscribe({
      next: () => {
        this.feedbackService.getFeedbacks().subscribe({
          next: (data) => {
            this.feedbacks = data;
          },
        });
        this.feedbackForm.reset();
      },
    });
  }
}
