import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChadComponent } from './single-chad.component';

describe('SingleChadComponent', () => {
  let component: SingleChadComponent;
  let fixture: ComponentFixture<SingleChadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleChadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleChadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
