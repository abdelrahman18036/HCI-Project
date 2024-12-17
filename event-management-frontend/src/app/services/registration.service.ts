// src/app/services/registration.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Registration,
  RegistrationCreateData,
} from '../models/registration.model'; // Import interfaces

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
