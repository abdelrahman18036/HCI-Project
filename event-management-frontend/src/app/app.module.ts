import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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

import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';
import { TicketService } from './services/ticket.service';
import { RegistrationService } from './services/registration.service';
import { FeedbackService } from './services/feedback.service';

import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    OrganizerComponent,
    AttendeeComponent,
    EventListComponent,
    EventDetailComponent,
    EventCreateComponent,
    TicketListComponent,
    TicketDetailComponent,
    RegistrationListComponent,
    FeedbackListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthService,
    EventService,
    TicketService,
    RegistrationService,
    FeedbackService,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
