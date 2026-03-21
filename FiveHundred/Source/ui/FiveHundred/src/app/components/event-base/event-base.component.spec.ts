import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBaseComponent } from './event-base.component';

describe('EventBaseComponent', () => {
  let component: EventBaseComponent;
  let fixture: ComponentFixture<EventBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
