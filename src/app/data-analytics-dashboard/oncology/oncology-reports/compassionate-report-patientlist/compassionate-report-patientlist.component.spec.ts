import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompassionateReportPatientlistComponent } from "./compassionate-report-patientlist.component";

describe("CompassionateReportPatientlistComponent", () => {
  let component: CompassionateReportPatientlistComponent;
  let fixture: ComponentFixture<CompassionateReportPatientlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompassionateReportPatientlistComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompassionateReportPatientlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
