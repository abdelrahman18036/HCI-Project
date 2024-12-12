import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../services/registration.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.css'],
})
export class RegistrationListComponent implements OnInit {
  registrations: any[] = [];

  constructor(
    private registrationService: RegistrationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registrationService.getRegistrations().subscribe({
      next: (data) => {
        this.registrations = data;
      },
    });
  }
}
