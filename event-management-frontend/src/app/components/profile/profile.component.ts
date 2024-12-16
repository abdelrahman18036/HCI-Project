// src/app/components/profile/profile.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  user_type: string;
  profile_image?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userProfile: UserProfile | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  hidePassword: boolean = true;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchUserProfile();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group(
      {
        username: [
          { value: '', disabled: true },
          [Validators.required, Validators.minLength(3)],
        ],
        email: [
          { value: '', disabled: true },
          [Validators.required, Validators.email],
        ],
        profile_image: [{ value: '', disabled: true }],
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
      next: (profile: UserProfile) => {
        this.userProfile = profile;
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          profile_image: profile.profile_image,
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error || 'Failed to fetch profile';
        this.isLoading = false;
      },
    });
  }

  onEdit(): void {
    this.isEditing = true;
    this.profileForm.get('username')?.enable();
    this.profileForm.get('email')?.enable();
    this.profileForm.get('profile_image')?.enable();
  }

  onCancel(): void {
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
    this.fetchUserProfile();
    this.profileForm.get('username')?.disable();
    this.profileForm.get('email')?.disable();
    this.profileForm.get('profile_image')?.disable();
    this.profileForm.get('password')?.reset();
    this.profileForm.get('password2')?.reset();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const { username, email, profile_image, password, password2 } =
      this.profileForm.value;

    const updatedData: any = { username, email };

    if (profile_image) {
      updatedData.profile_image = profile_image;
    }

    updatedData.user_type = this.userProfile?.user_type;

    if (password) {
      updatedData.password = password;
      updatedData.password2 = password2;
    }

    this.isLoading = true;
    this.authService.updateProfile(updatedData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully.';
        this.errorMessage = '';
        this.isLoading = false;
        this.isEditing = false;
        this.profileForm.get('username')?.disable();
        this.profileForm.get('email')?.disable();
        this.profileForm.get('profile_image')?.disable();
        this.profileForm.get('password')?.reset();
        this.profileForm.get('password2')?.reset();
        // Refresh the profile data
        this.fetchUserProfile();
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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
