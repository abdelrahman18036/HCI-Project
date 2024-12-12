import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css'],
})
export class TicketDetailComponent implements OnInit {
  ticket: any;
  ticketId!: number;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    this.ticketService.getTicket(this.ticketId).subscribe({
      next: (data) => {
        this.ticket = data;
      },
    });
  }

  edit(): void {
    this.router.navigate(['/tickets', this.ticketId, 'edit']);
  }

  delete(): void {
    this.ticketService.deleteTicket(this.ticketId).subscribe({
      next: () => {
        this.router.navigate(['/tickets']);
      },
    });
  }
}
