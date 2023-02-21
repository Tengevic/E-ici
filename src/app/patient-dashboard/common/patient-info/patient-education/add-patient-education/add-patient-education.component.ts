import { Component, OnInit, OnDestroy } from "@angular/core";
import { Patient } from "src/app/models/patient.model";
import { Subscription } from "rxjs";
import { PersonAttributeResourceService } from "src/app/openmrs-api/person-attribute-resource.service";
import { PatientService } from "src/app/patient-dashboard/services/patient.service";
import { ConceptResourceService } from "src/app/openmrs-api/concept-resource.service";
import { PersonResourceService } from "src/app/openmrs-api/person-resource.service";
import { subscribeOn } from "rxjs/operators";

@Component({
  selector: "add-patient-education",
  templateUrl: "./add-patient-education.component.html",
  styleUrls: ["./add-patient-education.component.css"],
})
export class AddPatientEducationComponent implements OnInit, OnDestroy {
  public displayErrors: boolean;
  public errorMessage = "";
  public patient: Patient;
  public isLoading: boolean;
  public errors: Array<any>;
  public successAlert: string;
  public errorAlert: string;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public display: boolean;
  public highestEducationConcept = "a89e48ae-1350-11df-a1f1-0026b9348838";
  public levelOfEducation: any;
  public patientHighestEducation: string;
  private subscription: Subscription;

  constructor(
    private personAttributeService: PersonAttributeResourceService,
    private patientService: PatientService,
    private conceptResourceService: ConceptResourceService,
    private personResourceService: PersonResourceService
  ) {}

  public ngOnInit() {
    this.getEducationLevels();
    this.getPatient();
  }

  public getPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient: Patient) => {
        if (patient) {
          this.patient = patient;
        }
      }
    );
  }

  public getEducationLevels() {
    this.conceptResourceService
      .getConceptByUuid(this.highestEducationConcept)
      .subscribe((educationLevels: any) => {
        if (educationLevels) {
          this.setHighestEduction(educationLevels.answers);
        }
      });
  }

  public setHighestEduction(educationLevels: Array<any>) {
    this.levelOfEducation = educationLevels.map((levels: any) => {
      return {
        value: levels.uuid,
        name: levels.display,
      };
    });
  }

  public saveAttribute() {
    this.isLoading = true;
    const personAttributePayload = {
      value: this.patientHighestEducation,
      attributeType: "18fa9439-1725-457e-b92e-d80d59843ee2",
    };

    this.personAttributeService
      .createPersonAttribute(this.patient.person.uuid, personAttributePayload)
      .subscribe(
        (success) => {
          if (success) {
            this.displaySuccessAlert("Education level save successfully");
            this.patientService.reloadCurrentPatient();
          }
        },
        (error) => {
          console.error("error", error);
          this.displayErrorAlert("Error adding education");
        }
      );
  }

  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
      this.display = false;
    }, 3000);
  }

  public dismissDialog() {
    this.display = false;
  }

  public showEducationDialog() {
    this.display = true;
  }

  public onSelectEducation(event) {
    this.patientHighestEducation = event;
  }

  private displayErrorAlert(message) {
    this.showErrorAlert = true;
    this.showSuccessAlert = false;
    this.successAlert = message;
    setTimeout(() => {
      this.showErrorAlert = false;
      this.display = false;
    }, 5000);
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
