import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditPatientEducationComponent } from "./edit-patient-education.component";

describe("EditPatientEducationComponent", () => {
  let component: EditPatientEducationComponent;
  let fixture: ComponentFixture<EditPatientEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPatientEducationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatientEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
