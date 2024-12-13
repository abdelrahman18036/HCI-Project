import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
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

  /**
   * Initialize the profile form.
   */
  private initializeForm(): void {
    this.profileForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        password2: [''],
      },
      { validator: this.passwordsMatchValidator }
    );
  }

  /**
   * Fetch the current user's profile from the backend.
   */
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
        this.errorMessage = error;
        this.isLoading = false;
      },
    });
  }

  /**
   * Handle form submission to update the profile.
   */
  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fill in the required fields correctly.';
      this.successMessage = '';
      return;
    }

    const { username, email, password, password2 } = this.profileForm.value;

    const updatedData: any = {
      username,
      email,
    };

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
        this.errorMessage = error;
        this.successMessage = '';
        this.isLoading = false;
      },
    });
  }

  /**
   * Toggle password visibility.
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Custom validator to check if passwords match.
   */
  private passwordsMatchValidator(
    group: FormGroup
  ): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const password2 = group.get('password2')?.value;
    if (password && password2 && password !== password2) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  // Getter methods for form controls
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
