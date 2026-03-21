import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustScoreComponent } from './adjust-score.component';

describe('AdjustScoreComponent', () => {
  let component: AdjustScoreComponent;
  let fixture: ComponentFixture<AdjustScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustScoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
