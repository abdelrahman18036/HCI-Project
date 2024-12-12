import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Registration {
  id?: number;
  attendee: number;
  event: number;
  ticket: number;
}

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private baseUrl = 'http://localhost:8000/api/registrations/';

  constructor(private http: HttpClient) {}

  getRegistrations(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  createRegistration(registration: Registration): Observable<any> {
    return this.http.post(this.baseUrl, registration);
  }
}
