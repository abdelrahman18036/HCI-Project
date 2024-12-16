// src/app/components/auth/login/login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // login.component.ts
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter your username and password.';
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        // Fetch user profile to update currentUserSubject
        this.authService.getProfile().subscribe({
          next: () => {
            // Redirect based on user type
            if (res.user_type === 'organizer') {
              this.router.navigate(['/organizer']);
            } else if (res.user_type === 'attendee') {
              this.router.navigate(['/attendee']);
            } else {
              this.errorMessage = 'Invalid user type.';
            }
          },
          error: (err) => {
            this.errorMessage = 'Failed to fetch user profile.';
          },
        });
      },
      error: (err: any) => {
        this.errorMessage = err;
        this.isLoading = false;
      },
    });
  }

  // Getter methods for form controls
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
