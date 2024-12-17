// src/app/services/event.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl = 'http://localhost:8000/api/events/';
  private ticketTypesUrl = 'http://localhost:8000/api/ticket-types/'; // New URL

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}?ordering=-is_promotion,-created_at`
    );
  }

  getEvent(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  createEvent(event: FormData): Observable<any> {
    return this.http.post(this.baseUrl, event);
  }

  updateEvent(id: number, event: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/`, event);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }

  getOrganizerEvents(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/organizer/events/');
  }

  getEventAttendees(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8000/api/events/${eventId}/attendees/`
    );
  }

  createTicket(eventId: number, ticketData: any): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8000/api/events/${eventId}/tickets/`,
      ticketData
    );
  }

  // New method to fetch ticket types
  getTicketTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.ticketTypesUrl);
  }
}
