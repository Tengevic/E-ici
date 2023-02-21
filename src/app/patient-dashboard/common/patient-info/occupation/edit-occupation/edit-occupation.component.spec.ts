import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditOccupationComponent } from "./edit-occupation.component";

describe("EditOccupationComponent", () => {
  let component: EditOccupationComponent;
  let fixture: ComponentFixture<EditOccupationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditOccupationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOccupationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
