// src/app/models/registration.model.ts

export interface EventDetails {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  ticket_price: string;
  promotional_image: string;
  promotional_video: string;
}

export interface Ticket {
  id: number;
  ticket_type: string;
  name: string;
  price: string;
  quantity: number;
  sold: number;
}

export interface Attendee {
  id: number;
  username: string;
  email: string;
}

export interface Registration {
  id: number;
  event_details?: EventDetails; // Make it optional
  ticket: Ticket;
  attendee: Attendee;
  registered_at: string;
}

export interface RegistrationCreateData {
  // Define the structure for creating a registration if needed
}
