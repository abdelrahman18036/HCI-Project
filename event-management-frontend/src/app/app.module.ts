//app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';

// Add all your component imports
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
import { ProfileComponent } from './components/profile/profile.component';

// Other imports
import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';
import { TicketService } from './services/ticket.service';
import { RegistrationService } from './services/registration.service';
import { FeedbackService } from './services/feedback.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [TicketDetailComponent, RegistrationListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    OrganizerComponent,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AttendeeComponent,
    EventListComponent,
    EventDetailComponent,
    EventCreateComponent,
    TicketListComponent,
    ProfileComponent,
    LoginComponent,
    SignupComponent,
  ],
  providers: [
    AuthService,
    EventService,
    TicketService,
    RegistrationService,
    FeedbackService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
})
export class AppModule {}
