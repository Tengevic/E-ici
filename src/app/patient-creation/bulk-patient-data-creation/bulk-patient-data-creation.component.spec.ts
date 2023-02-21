import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPatientDataCreationComponent } from './bulk-patient-data-creation.component';

describe('BulkPatientDataCreationComponent', () => {
  let component: BulkPatientDataCreationComponent;
  let fixture: ComponentFixture<BulkPatientDataCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkPatientDataCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkPatientDataCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
