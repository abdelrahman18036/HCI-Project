//app.routes.ts;
import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OrganizerComponent } from './components/dashboard/organizer/organizer.component';
import { AttendeeComponent } from './components/dashboard/attendee/attendee.component';
import { EventListComponent } from './components/events/event-list/event-list.component';
import { EventDetailComponent } from './components/events/event-detail/event-detail.component';
import { EventCreateComponent } from './components/events/event-create/event-create.component';
import { TicketListComponent } from './components/tickets/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './components/tickets/ticket-detail/ticket-detail.component';
import { RegistrationListComponent } from './components/registrations/registration-list/registration-list.component';
import { EventEditComponent } from './components/events/event-edit/event-edit.component';
import { AuthGuard } from './guards/auth.guard';
import { OrganizerAnalyticsComponent } from './components/organizer-analytics/organizer-analytics.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'organizer',
    component: OrganizerComponent,
    canActivate: [AuthGuard],
  },
  { path: 'attendee', component: AttendeeComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventListComponent },
  {
    path: 'events/create',
    component: EventCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'events/:id', component: EventDetailComponent },
  {
    path: 'events/:id/edit',
    component: EventEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'tickets', component: TicketListComponent },
  { path: 'tickets/:id', component: TicketDetailComponent },
  {
    path: 'registrations',
    component: RegistrationListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'organizer/analytics',
    component: OrganizerAnalyticsComponent,
    canActivate: [AuthGuard], // Protect the route
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' },
];
