// src/app/guards/redirect-if-logged-in.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RedirectIfLoggedInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser.pipe(
      take(1),
      map((user) => {
        if (user) {
          // Redirect based on user type
          if (user.user_type === 'organizer') {
            this.router.navigate(['/organizer']);
          } else if (user.user_type === 'attendee') {
            this.router.navigate(['/attendee']);
          }
          return false;
        }
        return true;
      })
    );
  }
}
