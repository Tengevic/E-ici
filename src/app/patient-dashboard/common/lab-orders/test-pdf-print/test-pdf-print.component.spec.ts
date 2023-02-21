import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TestPdfPrintComponent } from "./test-pdf-print.component";

describe("TestPdfPrintComponent", () => {
  let component: TestPdfPrintComponent;
  let fixture: ComponentFixture<TestPdfPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestPdfPrintComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPdfPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
