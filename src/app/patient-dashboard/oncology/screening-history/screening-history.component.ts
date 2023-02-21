import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { Patient } from "../../../models/patient.model";
import { PatientService } from "../../services/patient.service";
import { OncologySummaryResourceService } from "../../../etl-api/oncology-summary-resource.service";

@Component({
  selector: "app-screening-history",
  templateUrl: "./screening-history.component.html",
  styleUrls: ["./screening-history.component.css"],
})
export class ScreeningHistoryComponent implements OnInit {
  public summaryLoaded = false;
  public hasData = false;
  public loadingSummary = false;
  public subscription: Subscription;
  public patient: Patient;
  public patientUuid: any;
  public errors: any = [];
  public patientData: any;
  public diagnosisChanges: any;
  @Input() public programUuid;
  public elementType = "svg";
  public format = "CODE39";
  public lineColor = "#000000";
  public width = 1;
  public height = 50;
  public displayValue = true;
  public fontOptions = "";
  public font = "monospace";
  public textAlign = "center";
  public textPosition = "bottom";
  public textMargin = 2;
  public fontSize = 20;
  public background = "#ffffff";
  public margin = 10;
  public marginTop = 10;
  public marginBottom = 10;
  public marginLeft = 10;
  public marginRight = 10;
  constructor(
    private patientService: PatientService,
    private oncologySummary: OncologySummaryResourceService
  ) {}

  public ngOnInit() {
    this.getPatient();
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
    this.loadingSummary = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.patientUuid = this.patient.person.uuid;
          this.loadOncologyDiagnosisHistory();
        }
      },
      (err) => {
        this.loadingSummary = false;
        this.errors.push({
          id: "patient",
          message: "error fetching patient",
        });
      }
    );
  }

  public loadOncologyDiagnosisHistory() {
    this.oncologySummary
      .getOncologySummary(
        "screening-history",
        this.patientUuid,
        this.programUuid
      )
      .subscribe(
        (summary) => {
          this.loadingSummary = false;
          this.summaryLoaded = true;
          if (summary.length) {
            this.diagnosisChanges = summary;
            this.hasData = true;
          }
        },
        (error) => {
          this.loadingSummary = false;
          this.errors.push({
            id: "summary",
            message: "Error fetching Screening history",
          });
        }
      );
  }
}
