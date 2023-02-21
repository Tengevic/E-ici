import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentDashboardComponent } from './treatment-dashboard.component';

describe('TreatmentDashboardComponent', () => {
  let component: TreatmentDashboardComponent;
  let fixture: ComponentFixture<TreatmentDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatmentDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
