import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerAnalyticsComponent } from './organizer-analytics.component';

describe('OrganizerAnalyticsComponent', () => {
  let component: OrganizerAnalyticsComponent;
  let fixture: ComponentFixture<OrganizerAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
