// src/app/services/analytics.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TicketSales {
  ticket_type: string;
  sold: number;
}

export interface EventAnalytics {
  event_id: number;
  title: string;
  total_registrations: number;
  total_feedback: number;
  average_rating: number;
  ticket_sales: TicketSales[];
  revenue: string; // Decimal as string
}

export interface OrganizerAnalytics {
  total_events: number;
  total_registrations: number;
  total_feedback: number;
  average_rating: number;
  total_revenue: string; // Decimal as string
  events: EventAnalytics[];
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private baseUrl = 'http://localhost:8000/api/organizer/analytics/';

  constructor(private http: HttpClient) {}

  getOrganizerAnalytics(): Observable<OrganizerAnalytics> {
    return this.http.get<OrganizerAnalytics>(this.baseUrl);
  }
}
