import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PatientEducationComponent } from "./patient-education.component";

describe("PatientEducationComponent", () => {
  let component: PatientEducationComponent;
  let fixture: ComponentFixture<PatientEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientEducationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
