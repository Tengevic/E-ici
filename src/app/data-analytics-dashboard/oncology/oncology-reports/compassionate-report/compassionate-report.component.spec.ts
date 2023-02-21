import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CompassionateReportComponent } from "./compassionate-report.component";

describe("CompassionateReportComponent", () => {
  let component: CompassionateReportComponent;
  let fixture: ComponentFixture<CompassionateReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompassionateReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompassionateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
