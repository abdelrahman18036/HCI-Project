import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  hidePassword: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchUserProfile();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        password2: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(
    group: FormGroup
  ): { [key: string]: any } | null {
    const password = group.get('password');
    const password2 = group.get('password2');

    if (
      password?.value &&
      password2?.value &&
      password.value !== password2.value
    ) {
      password2?.setErrors({ mismatch: true });
      return { passwordsMismatch: true };
    }

    return null;
  }

  private fetchUserProfile(): void {
    this.isLoading = true;
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error || 'Failed to fetch profile';
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const { username, email, password, password2 } = this.profileForm.value;

    const updatedData: any = { username, email };

    if (password) {
      updatedData.password = password;
    }

    this.isLoading = true;
    this.authService.updateProfile(updatedData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully.';
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error || 'Failed to update profile';
        this.successMessage = '';
        this.isLoading = false;
      },
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  // Getters for easy access in template
  get username() {
    return this.profileForm.get('username');
  }
  get email() {
    return this.profileForm.get('email');
  }
  get password() {
    return this.profileForm.get('password');
  }
  get password2() {
    return this.profileForm.get('password2');
  }
}
