import { Component, OnInit, OnDestroy } from "@angular/core";

import { Subscription } from "rxjs";
import { Patient } from "../../../models/patient.model";
import { PatientService } from "../../services/patient.service";
import { AppFeatureAnalytics } from "../../../shared/app-analytics/app-feature-analytics.service";

@Component({
  selector: "patient-demographics",
  templateUrl: "./patient-demographics.component.html",
  styleUrls: ["./patient-demographics.component.css"],
})
export class PatientDemographicsComponent implements OnInit, OnDestroy {
  public patient: Patient = new Patient({});
  public clinicTrialStatus = "NO";
  public messageType: string;
  public message: string;
  public isVisible: boolean;
  public busy: Subscription;
  public errors: any = [];
  public subscription: Subscription;

  constructor(
    private patientService: PatientService,
    private appFeatureAnalytics: AppFeatureAnalytics
  ) {}
  public getPatientDemographics() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          this.determineClinicalTrial(this.patient);
        }
      },
      (err) => {
        this.errors.push({
          id: "patient-demographics",
          message: "error fetching patient",
        });
      }
    );
  }
  public determineClinicalTrial(patient) {
    const currentPatientValue = patient.person.ifClinicalTrialPatient as any;
    if (currentPatientValue === true) {
      this.clinicTrialStatus = "YES";
    } else {
      this.clinicTrialStatus = "NO";
    }
  }
  public ngOnInit() {
    this.getPatientDemographics();
    this.appFeatureAnalytics.trackEvent(
      "Patient Dashboard",
      "Lab Orders Loaded",
      "ngOnInit"
    );
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
