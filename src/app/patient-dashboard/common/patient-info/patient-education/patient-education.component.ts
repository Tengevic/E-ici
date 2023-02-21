import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Patient } from "src/app/models/patient.model";
import { Subscription } from "rxjs";
import { PersonAttributeResourceService } from "src/app/openmrs-api/person-attribute-resource.service";
import { PatientService } from "src/app/patient-dashboard/services/patient.service";
import { ConceptResourceService } from "src/app/openmrs-api/concept-resource.service";
import { PersonResourceService } from "src/app/openmrs-api/person-resource.service";

@Component({
  selector: "patient-education",
  templateUrl: "./patient-education.component.html",
  styleUrls: ["./patient-education.component.css"],
})
export class PatientEducationComponent implements OnInit {
  public patientHighestEducation: any;
  @Input() public patient: Patient;

  public ngOnInit() {}
}
