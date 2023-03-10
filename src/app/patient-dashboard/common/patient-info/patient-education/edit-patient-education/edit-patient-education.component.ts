import { Component, OnInit, Input } from "@angular/core";
import { Patient } from "src/app/models/patient.model";
import { ConceptResourceService } from "src/app/openmrs-api/concept-resource.service";
import { PersonResourceService } from "src/app/openmrs-api/person-resource.service";
import { PatientService } from "src/app/patient-dashboard/services/patient.service";

@Component({
  selector: "edit-patient-education",
  templateUrl: "./edit-patient-education.component.html",
  styleUrls: ["./edit-patient-education.component.css"],
})
export class EditPatientEducationComponent implements OnInit {
  public display = false;
  public isLoading: boolean;
  public errors: Array<any>;
  public successAlert: string;
  public errorAlert: string;
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public highestEducationConcept = "a89e48ae-1350-11df-a1f1-0026b9348838";
  public levelOfEducation: any;
  public selectPatientEducation: string;
  @Input() public patient: Patient;

  constructor(
    private conceptResourceService: ConceptResourceService,
    private personResourceService: PersonResourceService,
    private patientService: PatientService
  ) {}

  public ngOnInit() {
    this.getEducationLevels();
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
      attributes: [
        {
          value: this.selectPatientEducation,
          attributeType: "352b0d51-63c6-47d0-a295-156bebee4fd5",
        },
      ],
    };

    const payLoad = this.personResourceService.generatePersonAttributePayload(
      personAttributePayload,
      this.patient.person.attributes
    );
    personAttributePayload.attributes = payLoad;
    this.personResourceService
      .saveUpdatePerson(this.patient.person.uuid, personAttributePayload)
      .subscribe(
        (success) => {
          if (success) {
            this.displaySuccessAlert("Education level save successfully");
            this.patientService.reloadCurrentPatient();
          }
        },
        (error) => {
          console.error("error", error);
          this.displayErrorAlert("Error updating patient education");
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

  public onSelectEducation($event) {
    this.selectPatientEducation = $event;
  }
  public dismissDialog() {
    this.display = false;
  }

  public showEducationDialog() {
    this.display = true;
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
}
