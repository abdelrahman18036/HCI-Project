// src/app/services/comment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id: number;
  event: number;
  attendee: {
    id: number;
    username: string;
    email: string;
  };
  content: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:8000/api/events/';

  constructor(private http: HttpClient) {}

  getComments(eventId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}${eventId}/comments/`);
  }

  postComment(eventId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}${eventId}/comments/`, {
      content,
    });
  }
}
