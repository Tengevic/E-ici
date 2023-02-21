import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ScreeningHistoryComponent } from "./screening-history.component";

describe("ScreeningHistoryComponent", () => {
  let component: ScreeningHistoryComponent;
  let fixture: ComponentFixture<ScreeningHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScreeningHistoryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
