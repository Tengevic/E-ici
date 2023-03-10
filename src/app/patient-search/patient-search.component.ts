/* tslint:disable:no-inferrable-types */
import { take } from "rxjs/operators/take";
import {
  Component,
  OnInit,
  OnDestroy,
  DoCheck,
  Output,
  Input,
  EventEmitter,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { PatientSearchService } from "./patient-search.service";
import { Patient } from "../models/patient.model";
import { Subscription } from "rxjs";
import { AppFeatureAnalytics } from "../shared/app-analytics/app-feature-analytics.service";

@Component({
  selector: "app-patient-search",
  templateUrl: "./patient-search.component.html",
  styleUrls: ["./patient-search.component.css"],
})
export class PatientSearchComponent implements OnInit, OnDestroy {
  public patients: Patient[];
  public referred: any[] = [];
  public errors: any[] = [];
  public isResetButton: boolean = true;
  public totalPatients: number;
  public isLoading: boolean = false;
  public dataLoaded: boolean = false;
  public hasConductedSearch = false;
  public page: number = 1;
  public adjustInputMargin: string = "240px";
  public subscription: Subscription;
  public referralSubscription: Subscription;
  public title: string = "Patient Search";
  public errorMessage: string = "";
  public noMatchingResults: boolean = false;
  public lastSearchString: string = "";
  public providerUuid: string = "";

  /*
   patientSelected emits the patient object
   to other components so they can use
   the selected patient

   The hide Result property is passed down
   from parent to child to hide results of
   patient search

  */
  @Output() public patientSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() public hideResults: boolean = false;
  @Input() public hideRegistration: boolean = false;

  private _searchString: string;
  public get searchString(): string {
    return this._searchString;
  }
  public set searchString(v: string) {
    this._searchString = v;
    this.hasConductedSearch = false;
  }

  constructor(
    private patientSearchService: PatientSearchService,
    private route: ActivatedRoute,
    private appFeatureAnalytics: AppFeatureAnalytics
  ) {}

  public ngOnInit() {
    // this.getPatientReferrals();
    if (window.innerWidth <= 768) {
      this.adjustInputMargin = "0";
    }
    this.route.queryParams.subscribe((params) => {
      if (params["reset"] !== undefined) {
        this.resetSearchList();
      } else {
        // load cached result
        this.errorMessage = "";
        this.patientSearchService.patientsSearchResults.pipe(take(1)).subscribe(
          (patients) => {
            this.onResultsFound(patients);
          },
          (error) => {
            this.onError(error);
          }
        );
      }
    });
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.referralSubscription) {
      this.referralSubscription.unsubscribe();
    }
  }

  public onResultsFound(results) {
    if (results.length > 0) {
      this.patients = results;
      this.totalPatients = this.patients.length;
      this.hideResults = false;
    } else {
      this.patients = [];
      this.totalPatients = 0;
      this.hideResults = true;
    }
    // clear the search text
    this.searchString = "";
    this.hasConductedSearch = true;
  }

  public onError(error) {
    this.isLoading = false;
    this.resetInputMargin();
    console.error("error", error);
    this.errorMessage = error;
    this.hasConductedSearch = false;
  }

  public loadPatient(): void {
    this.totalPatients = 0;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.searchString && this.searchString.length > 2) {
      if (window.innerWidth > 768) {
        this.adjustInputMargin = "267px";
      }
      this.isLoading = true;
      this.patients = [];
      this.errorMessage = "";
      this.subscription = this.patientSearchService
        .searchPatient(this.searchString, false)
        .subscribe(
          (data) => {
            this.isLoading = false;
            const searchTerm = this.searchString;
            this.onResultsFound(data);
            if (data.length === 0) {
              this.noMatchingResults = true;
              this.lastSearchString = searchTerm;
            }
            this.resetInputMargin();
            // app feature analytics
            this.appFeatureAnalytics.trackEvent(
              "Patient Search",
              "Patients Searched",
              "loadPatient"
            );
          },
          (error) => {
            this.onError(error);
          }
        );

      this.isResetButton = true;
    }
  }

  public updatePatientCount(search) {
    if (this.totalPatients > 0 && search.length > 0) {
      this.totalPatients = 0;
    }
    this.noMatchingResults = false;
  }

  public selectPatient(patient) {
    this.patientSelected.emit(patient);
    this.hideResults = true;
  }

  public resetSearchList() {
    this.hideResults = true;
    this.patientSearchService.resetPatients();
    this.searchString = "";
    this.totalPatients = 0;
    this.isResetButton = false;
    this.isLoading = false;
    this.hasConductedSearch = false;
    this.resetInputMargin();
    this.noMatchingResults = false;
  }

  public resetInputMargin() {
    if (window.innerWidth > 768) {
      this.adjustInputMargin = "240px";
    }
  }
}
