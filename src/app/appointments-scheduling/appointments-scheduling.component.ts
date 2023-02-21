import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from 'angular-calendar';
import {
  startOfDay, endOfDay, subDays, addDays, endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  startOfMonth
} from 'date-fns';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import * as Moment from 'moment';
import { ClinicDashboardCacheService } from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import * as _ from 'lodash';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-appointments-scheduling',
  templateUrl: './appointments-scheduling.component.html',
  styleUrls: ['./appointments-scheduling.component.css']
})
export class AppointmentsSchedulingComponent implements OnInit {
  public viewDate = Moment().format('MMMM YYYY');
  public view = 'month';
  public filter: any = {
     'programType': [],
     'visitType': [],
     'encounterType': []
  };
  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  public params: any;
  public events: CalendarEvent[] = [];
  public activeDayIsOpen = false;
  public location  = '';
  public busy: Subscription;
  public fetchError = false;
  public programVisitsEncounters: any = [];
  public encounterTypes: any [];
  public monthControl  = true;
  public trackEncounterTypes: any = [];
  private subs: Subscription[] = [];
  private _datePipe: DatePipe;
  public referred: any[] = [];
  public errors: any[] = [];
  public isResetButton: boolean = true;
  public totalPatients: number;
  public isLoading: boolean = false;
  public dataLoaded: boolean = false;
  public hasConductedSearch = false;
  public page: number = 1;
  public adjustInputMargin: string = '240px';
  public subscription: Subscription;
  public referralSubscription: Subscription;
  public title: string = 'Patient Search';
  public errorMessage: string = '';
  public noMatchingResults: boolean = false;
  public lastSearchString: string = '';
  public providerUuid: string = '';

  @Output() public patientSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() public hideResults: boolean = false;
  @Input() public hideRegistration: boolean = false;

  private _searchString: string;
  public get searchString(): string {
    return this._searchString;
  }
  public set searchString(v: string) {
    this._searchString = v;
    // this.hasConductedSearch = false;
  }
  constructor() { }

  ngOnInit() {
  }
  public beforeMonthViewRender(days: CalendarMonthViewDay[]): void {
    if (_.isArray(days)) {

      days.forEach(day => {
        day.badgeTotal = 0;
      });

    }
  }
  public dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {

  }
//  public updatePatientCount(search) {
//     if (this.totalPatients > 0 && search.length > 0) {
//         this.totalPatients = 0;

//     }
//     this.noMatchingResults = false;
//   }
  public loadPatient(): void {
  }

  public resetSearchList() {
  }
  public updatePatientCount(search) {
  }
}
