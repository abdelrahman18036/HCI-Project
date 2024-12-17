// src/app/services/feedback.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Feedback {
  id: number;
  event: number;
  attendee: {
    id: number;
    username: string;
    email: string;
  };
  comment: string;
  rating: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private baseUrl = 'http://localhost:8000/api/events/';

  constructor(private http: HttpClient) {}

  getFeedbacks(eventId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.baseUrl}${eventId}/feedback/`);
  }

  submitFeedback(
    eventId: number,
    feedbackData: { comment: string; rating: number }
  ): Observable<Feedback> {
    const data = {
      ...feedbackData,
      event: eventId, // Add the eventId here
    };
    return this.http.post<Feedback>(
      `${this.baseUrl}${eventId}/feedback/`,
      data
    );
  }
}
