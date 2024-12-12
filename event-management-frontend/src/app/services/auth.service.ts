// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

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

  signup(data: SignupData) {
    return this.http.post(`${this.baseUrl}signup/`, data);
  }

  login(data: LoginData) {
    return this.http.post(`${this.baseUrl}login/`, data);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  setToken(token: any) {
    localStorage.setItem('currentUser', JSON.stringify(token));
    this.currentUserSubject.next(token);
  }

  getToken() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}').access;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
