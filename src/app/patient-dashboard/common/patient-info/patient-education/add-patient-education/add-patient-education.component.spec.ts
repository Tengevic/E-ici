import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddPatientEducationComponent } from "./add-patient-education.component";

describe("AddPatientEducationComponent", () => {
  let component: AddPatientEducationComponent;
  let fixture: ComponentFixture<AddPatientEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPatientEducationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
