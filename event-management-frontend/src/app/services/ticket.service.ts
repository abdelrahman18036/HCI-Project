import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Ticket {
  id?: number;
  event: number;
  ticket_type: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private baseUrl = 'http://localhost:8000/api/tickets/';

  constructor(private http: HttpClient) {}

  getTickets(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getTicket(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${id}/`);
  }

  createTicket(ticket: Ticket): Observable<any> {
    return this.http.post(this.baseUrl, ticket);
  }

  updateTicket(id: number, ticket: Ticket): Observable<any> {
    return this.http.put(`${this.baseUrl}${id}/`, ticket);
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}
