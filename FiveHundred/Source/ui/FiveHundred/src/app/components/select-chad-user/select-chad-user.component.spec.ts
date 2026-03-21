import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectChadUserComponent } from './select-chad-user.component';

describe('SelectChadUserComponent', () => {
  let component: SelectChadUserComponent;
  let fixture: ComponentFixture<SelectChadUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectChadUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChadUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
