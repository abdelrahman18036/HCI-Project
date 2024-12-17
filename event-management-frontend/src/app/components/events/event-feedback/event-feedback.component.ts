// src/app/components/events/event-feedback/event-feedback.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { FeedbackService, Feedback } from '../../../services/feedback.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-feedback',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './event-feedback.component.html',
  styleUrls: ['./event-feedback.component.css'],
})
export class EventFeedbackComponent implements OnInit {
  @Input() eventId!: number;
  feedbacks: Feedback[] = [];
  feedbackForm!: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private feedbackService: FeedbackService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadFeedbacks();
  }

  private initializeForm(): void {
    this.feedbackForm = this.fb.group({
      comment: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.feedbackService.getFeedbacks(this.eventId).subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load feedbacks.';
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.invalid) {
      this.errorMessage = 'Please provide valid feedback.';
      return;
    }

    this.isLoading = true;
    const feedbackData = this.feedbackForm.value;

    this.feedbackService.submitFeedback(this.eventId, feedbackData).subscribe({
      next: (feedback) => {
        this.feedbacks.unshift(feedback); // Add new feedback to the top
        this.successMessage = 'Feedback submitted successfully.';
        this.errorMessage = '';
        this.feedbackForm.reset({ comment: '', rating: 5 });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to submit feedback.';
        this.successMessage = '';
        this.isLoading = false;
      },
    });
  }
}
