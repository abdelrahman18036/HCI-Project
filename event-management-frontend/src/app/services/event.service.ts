import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Event {
  id?: number;
  organizer?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  ticket_price: number;
  promotional_image?: File;
  promotional_video?: File;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl = 'http://localhost:8000/api/events/';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any[]> {
    // Order by is_promotion descending and created_at descending
    return this.http.get<any[]>(
      `${this.baseUrl}?ordering=-is_promotion,-created_at`
    );
  }

  getEvent(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  createEvent(event: Event): Observable<any> {
    const formData = new FormData();
    for (const key in event) {
      if (event[key as keyof Event]) {
        formData.append(key, event[key as keyof Event] as any);
      }
    }
    return this.http.post(this.baseUrl, formData);
  }

  updateEvent(id: number, event: Event): Observable<any> {
    const formData = new FormData();
    for (const key in event) {
      if (event[key as keyof Event]) {
        formData.append(key, event[key as keyof Event] as any);
      }
    }
    return this.http.put(`${this.baseUrl}${id}/`, formData);
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
}
