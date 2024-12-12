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

  getEvents(): Observable<any> {
    return this.http.get(this.baseUrl);
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
}
