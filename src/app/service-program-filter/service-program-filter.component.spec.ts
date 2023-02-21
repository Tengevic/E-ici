import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProgramFilterComponent } from './service-program-filter.component';

describe('ServiceProgramFilterComponent', () => {
  let component: ServiceProgramFilterComponent;
  let fixture: ComponentFixture<ServiceProgramFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProgramFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProgramFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
