import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChadListComponent } from './chad-list.component';

describe('ChadListComponent', () => {
  let component: ChadListComponent;
  let fixture: ComponentFixture<ChadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChadListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
