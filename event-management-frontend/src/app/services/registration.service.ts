// src/app/services/registration.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  // Add other relevant fields
}

interface Ticket {
  id: number;
  ticket_type: string;
  price: number;
  quantity: number;
  sold: number;
  // Add other relevant fields
}

interface Registration {
  attendee: number;
  event: Event;
  ticket: Ticket;
  registered_at: string;
}

interface RegistrationCreateData {
  event: number;
  ticket: number;
}

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = 'http://localhost:8000/api/registrations/';
  private attendeeRegistrationsUrl =
    'http://localhost:8000/api/attendee/registrations/';

  constructor(private http: HttpClient) {}

  getRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.apiUrl);
  }

  getRegistration(id: number): Observable<Registration> {
    return this.http.get<Registration>(`${this.apiUrl}${id}/`);
  }

  createRegistration(data: RegistrationCreateData): Observable<Registration> {
    return this.http.post<Registration>(this.apiUrl, data);
  }

  deleteRegistration(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  getAttendeeRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.attendeeRegistrationsUrl);
  }
}
