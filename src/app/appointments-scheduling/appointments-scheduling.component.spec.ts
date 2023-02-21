import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsSchedulingComponent } from './appointments-scheduling.component';

describe('AppointmentsSchedulingComponent', () => {
  let component: AppointmentsSchedulingComponent;
  let fixture: ComponentFixture<AppointmentsSchedulingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentsSchedulingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
