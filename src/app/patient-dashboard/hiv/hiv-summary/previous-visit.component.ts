import { Component, OnInit, OnDestroy, Inject } from "@angular/core";

import * as _ from "lodash";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";

import { Encounter } from "../../../models/encounter.model";
import { Form, DataSources } from "ngx-openmrs-formentry";
import { Patient } from "../../../models/patient.model";
import { FileUploadResourceService } from "../../../etl-api/file-upload-resource.service";
import { FormDataSourceService } from "../../common/formentry/form-data-source.service";
import { PatientService } from "../../services/patient.service";
import { VisitResourceService } from "../../../openmrs-api/visit-resource.service";
@Component({
  selector: "previous-visit-details",
  templateUrl: "./previous-visit.component.html",
  styles: [
    `
      #encounter {
        border: 1px solid lightgray;
      }
      .list-group {
        border-radius: 5px;
      }
      .container-fluid {
        margin-top: 15px;
      }
      .list-group-item {
        padding-bottom: 15px;
        font-size: 12px !important;
      }
      .list-group-item:first-child,
      .list-group-item:last-child {
        border-radius: 10px;
      }
    `,
  ],
})
export class PreviousVisitComponent implements OnInit, OnDestroy {
  public patient: Patient;
  public patientUuid: any;
  public selectedEncounter: any = {};
  public subscription: Subscription;
  public form: Form;
  public errors: any = [];
  public encounters: Encounter[];
  public lastVisit;
  public busy: Subscription;
  public errorMessage: string;
  public error: boolean;
  public showLoader: boolean;
  public loaderText: string;

  constructor(
    private patientService: PatientService,
    private visitResourceService: VisitResourceService,
    private fileUploadResourceService: FileUploadResourceService,
    @Inject(DataSources) private dataSources: DataSources,
    private formDataSourceService: FormDataSourceService
  ) {}

  public ngOnInit(): void {
    this.getPatient();
    this.wireDataSources();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.busy) {
      this.busy.unsubscribe();
    }
  }

  public wireDataSources(): void {
    this.dataSources.registerDataSource("file", {
      fileUpload: this.fileUploadResourceService.upload.bind(
        this.fileUploadResourceService
      ),
      fetchFile: this.fileUploadResourceService.getFile.bind(
        this.fileUploadResourceService
      ),
    });
    this.dataSources.registerDataSource(
      "location",
      this.formDataSourceService.getDataSources()["location"]
    );
    this.dataSources.registerDataSource(
      "provider",
      this.formDataSourceService.getDataSources()["provider"]
    );
    this.dataSources.registerDataSource(
      "drug",
      this.formDataSourceService.getDataSources()["drug"]
    );
    this.dataSources.registerDataSource(
      "problem",
      this.formDataSourceService.getDataSources()["problem"]
    );
    this.dataSources.registerDataSource(
      "locationLogo",
      this.formDataSourceService.getDataSources()["locationLogo"]
    );
    this.dataSources.registerDataSource(
      "personAttribute",
      this.formDataSourceService.getDataSources()["location"]
    );
  }

  public getPatient(): void {
    this.showLoader = true;
    this.loaderText = "Fetching Encounters...";
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.patientUuid = this.patient.person.uuid;
          this.getLastVisitEncounters(this.patientUuid);
        }
      },
      (err) => {
        this.errors.push({
          id: "patient",
          message: "error fetching patient",
        });
      }
    );
  }

  public getLastVisitEncounters(patientUuid: any): void {
    const searchParams = "custom:(uuid,encounters)";
    this.visitResourceService
      .getPatientVisits({ patientUuid: patientUuid, v: searchParams })
      .pipe(take(1))
      .subscribe((visits) => {
        _.forEach(visits, (visit) => {
          if (visit.encounters.length > 0) {
            this.lastVisit = visit;
            return false;
          }
        });
        if (this.lastVisit) {
          this.error = false;
          this.showLoader = false;
          this.encounters = this.lastVisit.encounters;
        } else {
          this.showLoader = false;
          this.error = true;
          this.errorMessage = "Last Visit had 0 encounters";
        }
      });
  }

  public displayEncounterObs(encounter: any): void {
    this.selectedEncounter = encounter;
  }
}
