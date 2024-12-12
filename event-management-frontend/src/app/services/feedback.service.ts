import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Feedback {
  id?: number;
  attendee: number;
  event: number;
  rating: number;
  comments?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private baseUrl = 'http://localhost:8000/api/feedback/';

  constructor(private http: HttpClient) {}

  getFeedbacks(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  createFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(this.baseUrl, feedback);
  }
}
