// src/app/components/organizer-analytics/organizer-analytics.component.ts

import { Component, OnInit } from '@angular/core';
import {
  AnalyticsService,
  OrganizerAnalytics,
  EventAnalytics,
} from '../../services/analytics.service';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-analytics',
  standalone: true,
  imports: [CommonModule, ChartModule, TableModule, RouterModule],
  templateUrl: './organizer-analytics.component.html',
  styleUrls: ['./organizer-analytics.component.css'],
})
export class OrganizerAnalyticsComponent implements OnInit {
  analytics!: OrganizerAnalytics;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Chart configurations
  pieData: any;
  pieOptions: any;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.fetchAnalytics();
  }

  fetchAnalytics(): void {
    this.isLoading = true;
    this.analyticsService.getOrganizerAnalytics().subscribe({
      next: (data: OrganizerAnalytics) => {
        this.analytics = data;
        this.setupChart();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load analytics data.';
        this.isLoading = false;
      },
    });
  }

  setupChart(): void {
    const labels = this.analytics.events.map((event) => event.title);
    const registrations = this.analytics.events.map(
      (event) => event.total_registrations
    );

    this.pieData = {
      labels: labels,
      datasets: [
        {
          data: registrations,
          backgroundColor: this.generateColors(labels.length),
          hoverBackgroundColor: this.generateColors(labels.length),
        },
      ],
    };

    this.pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
      colors.push(color);
    }
    return colors;
  }

  logout(): void {
    // Implement logout logic
  }
}
