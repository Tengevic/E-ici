import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupEnrollmentComponent } from './group-enrollment.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgicimrsSharedModule } from 'src/app/shared/ngicimrs-shared.module';

describe('GroupEnrollmentComponent', () => {
  let component: GroupEnrollmentComponent;
  let fixture: ComponentFixture<GroupEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClientTestingModule,
        NgicimrsSharedModule
      ],
      declarations: [GroupEnrollmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
