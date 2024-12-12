// src/app/components/auth/login/login.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

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

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.authService.setToken(res);
        // Redirect based on user type
        if (res.user_type === 'organizer') {
          this.router.navigate(['/organizer']);
        } else {
          this.router.navigate(['/attendee']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      },
    });
  }
}
