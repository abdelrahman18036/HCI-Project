import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { OrganizerComponent } from './components/dashboard/organizer/organizer.component';
import { AttendeeComponent } from './components/dashboard/attendee/attendee.component';
import { EventListComponent } from './components/events/event-list/event-list.component';
import { EventDetailComponent } from './components/events/event-detail/event-detail.component';
import { EventCreateComponent } from './components/events/event-create/event-create.component';
import { TicketListComponent } from './components/tickets/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './components/tickets/ticket-detail/ticket-detail.component';
import { RegistrationListComponent } from './components/registrations/registration-list/registration-list.component';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
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
  { path: 'tickets', component: TicketListComponent },
  { path: 'tickets/:id', component: TicketDetailComponent },
  {
    path: 'registrations',
    component: RegistrationListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'feedback', component: FeedbackListComponent },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
