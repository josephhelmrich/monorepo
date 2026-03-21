import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardErrorComponent } from './hard-error.component';

describe('HardErrorComponent', () => {
  let component: HardErrorComponent;
  let fixture: ComponentFixture<HardErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HardErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HardErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
