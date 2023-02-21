import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';

import { ObsResourceService } from '../../../openmrs-api/obs-resource.service';
import { OrderResourceService } from '../../../openmrs-api/order-resource.service';
import { PatientService } from '../../services/patient.service';
import { ProcedureOrdersComponent } from './procedure-orders/procedure-orders.component';
import { ProcedureOrdersService } from './procedure-orders/procedure-orders.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';
import { UserService } from '../../../openmrs-api/user.service';

@Component({
  selector: 'app-patient-imaging-reports',
  templateUrl: './patient-imaging-reports.component.html',
  styleUrls: ['./patient-imaging-reports.component.css']
})
export class PatientImagingReportsComponent implements OnInit {
  public procedureOrders: ProcedureOrdersComponent;
  private personUuid: string;
  public subscriptions = [];
  public currentDate;
  public patientObs: any;
  public currentView = 'histology';
  private provider: string;
  public selectedLocation: string;
  public location: string;
  public radiologyImagingConcepts = {
    results: '6bf6400f-8254-4942-99d8-e9f886c6a7b3',
    name: 'radiology',
    icon: 'icon-i-cath-lab',
    imageConcept: '3e491ddf-ad07-4ab7-be73-48ed4983363c',
    report: 'Radiology Reports',
    // list: '8a93e5c1-b374-445d-8f1f-78364bd2108c'
    list: 'c16a95ef-cc19-484b-b54f-7e071423b3f1'
  };
  // public surgeryConcepts = {
  //   results: '4c057eae-f3d7-4df9-898d-8345e721370d',
  //   name: 'surgery',
  //   icon: 'icon-i-imaging-root-category',
  //   imageConcept: '969681ad-b4cb-4d37-a32b-fd553a7aab30',
  //   report: 'Surgery Reports',
  //   list: 'b8ad835f-d568-4588-983e-48ba432f67b5'
  // };
  public proceduresConcepts = {
    results: 'c8c960ff-439e-49c9-b834-3bfa73140981',
    // results: 'acf1eda7-7c5e-41c5-94b7-22a57fd34eb2',
    name: 'procedure',
    icon: 'icon-i-immunizations',
    imageConcept: '9ab23532-40e4-4e98-85bd-bb9478d805ac',
    report: 'Procedure Reports',
    list: '2012a1c5-3be4-4ba7-a76d-22db951296ed'
  };
  public histopathologyConcepts = {
    results: '6bf6400f-8254-4942-99d8-e9f886c6a7b3',
    name: 'Test / Procedure',
    icon: 'icon-i-imaging-root-category',
    imageConcept: '3e491ddf-ad07-4ab7-be73-48ed4983363c',
    report: 'Histopathology Reports',
    list: '75b4b002-bab3-47c7-a332-2f069d610228'
  };
  public caresetting = '6f0c9a92-6f24-11e3-af88-005056821db0';
  public subscription: Subscription;
  private patient: any;
  private patientIdentifier: any;
  public imageServerId: any;
  public obsPayload: any;
  public innerValue = null;
  public sharedData: any;
  private refresh = false;

  constructor(
    private userService: UserService,
    private orderResourceService: OrderResourceService,
    private procedureOrderService: ProcedureOrdersService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private obsResourceService: ObsResourceService,
    private patientService: PatientService) { }

  public ngOnInit(): void {
    this.personUuid = this.userService.getLoggedInUser().personUuid;
    this.sharedData = {
      orders: '',
      location: '',
      patient: '',
      provider: this.getProvider(),
      caresetting: this.caresetting
    };
    this.getCurrentlyLoadedPatient();
    this.currentDate = Date.now();
  }

  public getCurrentlyLoadedPatient(): void {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.sharedData.patient = patient.uuid;
          this.getPatientObs(patient.uuid);
          this.getOrders();
        }
      }
    );
  }

  public resolveUserLocation(): void {
    const currentLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    this.location = currentLocation.display;
    this.selectedLocation = currentLocation.uuid;
    this.sharedData.location = this.selectedLocation;
  }

  public getOrders(): void {
    this.orderResourceService.getAllOrdersByPatientUuuid(this.patient.uuid, this.caresetting)
      .subscribe((data) => {
        this.sharedData.orders = data.results;
        this.refresh = true;
      });
  }

  public getProvider(): string {
    this.procedureOrderService.getProviderByPersonUuid(this.personUuid).subscribe((data) => {
      this.provider = data.providerUuid;
    });
    return this.provider;
  }

  public getPatientObs(patientUuid): void {
    // const orderResultsConcept = '9ab23532-40e4-4e98-85bd-bb9478d805ac';
    const orderResultsConcept = '9ab23532-40e4-4e98-85bd-bb9478d805ac';
    this.obsResourceService.getObsPatientObsByConcept(patientUuid, orderResultsConcept)
      .subscribe((result: any) => {
        this.patientObs = result.results;
      }, (error) => {
        console.error('Error getting patient obs: ', error);
      }
    );
  }

  public onTabChanged(event): void {
    if (event.index === 0) {
      this.currentView = 'histology';
    }
  }
}
