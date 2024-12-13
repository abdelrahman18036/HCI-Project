// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface SignupData {
  username: string;
  email: string;
  password: string;
  password2: string;
  user_type: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  user_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api/auth/';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(
      user ? JSON.parse(user) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  signup(data: SignupData): Observable<any> {
    return this.http
      .post(`${this.baseUrl}signup/`, data)
      .pipe(catchError(this.handleError));
  }

  login(data: LoginData): Observable<any> {
    return this.http.post(`${this.baseUrl}login/`, data).pipe(
      tap((response: any) => {
        if (response.access) {
          this.setToken(response);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  setToken(token: any): void {
    localStorage.setItem('currentUser', JSON.stringify(token));
    this.currentUserSubject.next(token);
  }

  getToken(): string | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.access || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Fetch the current user's profile.
   */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}profile/`).pipe(
      tap((profile: UserProfile) => {
        const currentUser = JSON.parse(
          localStorage.getItem('currentUser') || '{}'
        );
        const updatedUser = { ...currentUser, ...profile };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update the current user's profile.
   * @param data - Partial<UserProfile> & { password?: string; password2?: string }
   */
  updateProfile(data: any): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}profile/`, data).pipe(
      tap((profile: UserProfile) => {
        const currentUser = JSON.parse(
          localStorage.getItem('currentUser') || '{}'
        );
        const updatedUser = { ...currentUser, ...profile };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors.
   * @param error
   */
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.detail) {
        errorMessage = error.error.detail;
      } else {
        errorMessage = Object.values(error.error).join(' ');
      }
    }
    return throwError(() => errorMessage);
  }
}
