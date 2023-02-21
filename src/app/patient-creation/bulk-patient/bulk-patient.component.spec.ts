import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPatientComponent } from './bulk-patient.component';

describe('BulkPatientComponent', () => {
  let component: BulkPatientComponent;
  let fixture: ComponentFixture<BulkPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
