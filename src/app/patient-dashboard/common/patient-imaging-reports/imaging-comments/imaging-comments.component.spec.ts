import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagingCommentsComponent } from './imaging-comments.component';

describe('ImagingCommentsComponent', () => {
  let component: ImagingCommentsComponent;
  let fixture: ComponentFixture<ImagingCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagingCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagingCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
