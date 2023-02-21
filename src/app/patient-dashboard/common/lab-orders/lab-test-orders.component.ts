import { take } from "rxjs/operators";
import { Component, OnInit, OnDestroy } from "@angular/core";

import * as Moment from "moment";
import * as _ from "lodash";
import { AppFeatureAnalytics } from "../../../shared/app-analytics/app-feature-analytics.service";
import { PatientService } from "../../services/patient.service";
import { OrderResourceService } from "../../../openmrs-api/order-resource.service";
import { LabelService } from "./labels/label-service";

import { Subscription } from "rxjs";
import { ClinicLabOrdersResourceService } from "../../../etl-api/clinic-lab-orders-resource.service";
import { ObsResourceService } from "../../../openmrs-api/obs-resource.service";
import { DatePipe } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import * as LabformsConfig from "./labformsconfig.json";
import { BixolonService } from "./labels/bixolon";

@Component({
  selector: "lab-test-orders",
  templateUrl: "./lab-test-orders.html",
  styleUrls: [],
  providers: [LabelService, BixolonService],
})
export class LabTestOrdersComponent implements OnInit, OnDestroy {
  public patient: any;
  public labOrders = [];
  public labOrdersEtl = [];
  public error: string;
  public page = 1;
  public fetchingResults: boolean;
  public isBusy: boolean;
  public subscription: Subscription;
  public displayDialog = false;
  public currentOrder: any;
  public allItemsSelected = false;
  public copies = 2;
  public patientIdentifer: any;
  public isPrinting = false;
  public collectionDate = new Date();
  public labPatient: any;
  public orderType: number;
  public labEncouonters: any;
  public accessionNumber: any;
  public sampleCollectedOptions = [
    { label: "Yes", val: "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
    { label: "No", val: "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
  ];
  public sampleCollected: any;
  public displaySampleDialog = false;
  public showErrorAlert = false;
  public showSuccessAlert = false;
  public successAlert = "";
  public errors: any = [];
  public orderUuid: string;
  public obsUuid: string;
  public displayConfirmDialog = false;
  public hideDateField = false;
  public disableButton = false;
  public maxDate = new Date();
  private _datePipe: DatePipe;
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
    private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService,
    private orderResourceService: OrderResourceService,
    private labelService: LabelService,
    private clinicLabOrdersResourceService: ClinicLabOrdersResourceService,
    private obsResourceService: ObsResourceService,
    public bixolonService: BixolonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._datePipe = new DatePipe("en-US");
  }

  public ngOnInit() {
    this.appFeatureAnalytics.trackEvent(
      "Patient Dashboard",
      "Lab Orders Loaded",
      "ngOnInit"
    );
    this.getCurrentlyLoadedPatient();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getCurrentlyLoadedPatient() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          const icimrsId = _.find(
            this.patient.identifiers.openmrsModel,
            (identifer: any) => {
              if (
                identifer.identifierType.uuid ===
                "58a4732e-1359-11df-a1f1-0026b9348838"
              ) {
                return true;
              }
            }
          );
          if (icimrsId) {
            this.patientIdentifer = icimrsId.identifier;
          }
          this.getLabOrdersByPatientUuid();
          this.getPatientLabOrders();
        }
      }
    );
  }

  public getPatientLabOrders() {
    this.fetchingResults = true;
    this.isBusy = true;
    const patientUuId = this.patient.uuid;
    this.orderResourceService
      .getOrdersByPatientUuid(patientUuId)
      .pipe(take(1))
      .subscribe(
        (result) => {
          this.labPatient = result.results[0].patient;
          this.labEncouonters = result.results;
          this.labOrders = result.results;

          this.labOrders.sort((a, b) => {
            const key1 = a.dateActivated;
            const key2 = b.dateActivated;
            if (key1 > key2) {
              return -1;
            } else if (key1 === key2) {
              return 0;
            } else {
              return 1;
            }
          });
          this.fetchingResults = false;
          this.isBusy = false;
        },
        (err) => {
          this.error = err;
          console.error("error", this.error);
        }
      );
  }
  public getLabOrdersByPatientUuid() {
    this.fetchingResults = true;
    this.isBusy = true;
    const patientUuId = this.patient.uuid;
    this.clinicLabOrdersResourceService
      .getLabOrdersByPatientUuid(patientUuId)
      .pipe(take(1))
      .subscribe((result) => {
        this.labOrdersEtl = result;
        this.labOrdersEtl.sort((a, b) => {
          const key1 = a.date_activated;
          const key2 = b.date_activated;
          if (key1 > key2) {
            return -1;
          } else if (key1 === key2) {
            return 0;
          } else {
            return 1;
          }
        });
        this.fetchingResults = false;
        this.isBusy = false;
      });
  }

  public postOrderToEid(order: any) {
    this.currentOrder = null;
    this.displayDialog = true;
    this.currentOrder = this.getCorrespingLabOrdersFromIcimrs(
      this.labEncouonters,
      order.orderNumber
    );
    // this.currentOrder = order;
  }

  public handleResetEvent(event) {
    this.displayDialog = false;
    this.currentOrder = null;
  }
  public collectionDateChanged(event) {}
  public setFormResults(order) {
    // confirm type lab results form

    LabformsConfig.testForms.forEach((config) => {
      Object.keys(config).map((key, index) => {
        if (key === order.conceptUuid) {
          this.router.navigate(["../formentry", config[key].uuid], {
            relativeTo: this.route,
            queryParams: {
              order: JSON.stringify({
                orderuuid: order.uuid,
                orderConcept: order.conceptUuid,
              }),
            },
          });
        }
      });
    });
  }

  public printLabel(order) {
    this.labelService.directPrint(this.getLabel(order), this.copies);
  }
  public printViaBixolon(label: String) {
    const bixolonPayload = {
      id: 6,
      functions: {
        func0: {
          checkLabelStatus: [],
        },
        func1: {
          clearBuffer: [],
        },
        func2: {
          setWidth: [432],
        },
        func3: {
          draw1DBarcode: [label, 1, 50, 1, 1, 1, 50, 0, 1],
        },
        func4: {
          draw1DBarcode: [label, 240, 60, 1, 1, 4, 50, 0, 1],
        },
        func5: {
          printBuffer: [],
        },
      },
    };
    this.bixolonService
      .printLabel(JSON.stringify(bixolonPayload))
      .pipe(take(1))
      .subscribe(
        (success) => {
          if (success) {
          }
        },
        (error) => {
          console.error("error", error);
          this.errors.push({
            id: "patient",
            message: "error posting obs",
          });
        }
      );
  }
  public collectedSample(order) {
    this.hideDateField = false;
    this.errors = [];
    if (order.sample_drawn === "YES") {
      this.sampleCollected = "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
      this.collectionDate = this._datePipe.transform(
        order.sample_collection_date,
        "yyyy-MM-dd"
      ) as any;
      this.disableButton = false;
    }
    if (order.sample_drawn === "NO") {
      this.hideDateField = true;
      this.sampleCollected = "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
      this.disableButton = false;
    }
    if (
      order.sample_drawn === null ||
      order.sample_drawn === "null" ||
      this.sampleCollected === ""
    ) {
      this.sampleCollected = " ";
      this.disableButton = true;
      this.maxDate = this._datePipe.transform(new Date(), "yyyy-MM-dd") as any;
      this.collectionDate = "" as any;
    }

    this.orderUuid = order.uuid;
    this.obsUuid = order.obs_uuid;
    this.orderType = order.order_type;

    this.displaySampleDialog = true;
  }
  public dismissSampleDialog() {
    this.displayConfirmDialog = true;
  }
  public saveSampleCollectedObs() {
    if (this.sampleCollected === " ") {
      const clone = { sampleMessage: "Sample collected is required" };
      this.errors.push(clone);
      this.errors = this.errors[0];
      console.log("this.errors", this.errors);
      return;
    }
    if (this.collectionDate === ("" as any)) {
      const clone = { message: "Date sample collected is required" };
      this.errors.push(clone);
      this.errors = this.errors[0];
      return;
    }
    const patientUuId = this.patient.uuid;
    const obsPayload = {
      person: patientUuId,
      order: this.orderUuid,
      accessionNumber: this.accessionNumber,
      concept: "d72e10ec-17c7-41fc-9257-140dd53918f5",
      value: this.sampleCollected,
      obsDatetime: this.toDateString(this.collectionDate),
    };
    if (this.obsUuid !== null) {
      this.obsResourceService
        .voidObs(this.obsUuid)
        .pipe(take(1))
        .subscribe(
          (success) => {
            if (success) {
              this.displaySuccessAlert("saved successfully");
              this.getCurrentlyLoadedPatient();
              this.getLabOrdersByPatientUuid();
              setTimeout(() => {
                this.displaySampleDialog = false;
              }, 1000);
            }
          },
          (error) => {
            console.error("error", error);
            this.errors.push({
              id: "patient",
              message: "error posting obs",
            });
            this.displaySampleDialog = true;
          }
        );
    }

    this.obsResourceService
      .saveObs(obsPayload)
      .pipe(take(1))
      .subscribe(
        (success) => {
          if (success) {
            this.displaySuccessAlert("saved successfully");
            this.getCurrentlyLoadedPatient();
            this.getLabOrdersByPatientUuid();
            setTimeout(() => {
              this.displaySampleDialog = false;
            }, 1000);
          }
        },
        (error) => {
          console.error("error", error);
          this.errors.push({
            id: "patient",
            message: "error posting obs",
          });
          this.displaySampleDialog = true;
        }
      );
    if (this.accessionNumber) {
      //save accesion to order
      const orderPayload = {
        fulfillerComment: "none",
        fulfillerStatus: "RECEIVED",
        accessionNumber: this.accessionNumber,
      };
      this.orderResourceService
        .saveOrderFulfillerDetails(orderPayload, this.orderUuid)
        .pipe(take(1))
        .subscribe(
          (result) => {
            console.log(result);
          },
          (err) => {
            this.error = err;
            console.error("error", this.error);
          }
        );
    }
  }
  public onSampleSelectedChange(selected) {
    this.errors = [];

    if (selected.target.value === "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
      this.collectionDate = this._datePipe.transform(
        new Date(),
        "yyyy-MM-dd"
      ) as any;
      this.hideDateField = true;
      this.disableButton = false;
      this.errors = [];
    }
    if (selected.target.value === "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
      this.generateSampleId();
      this.hideDateField = false;
      this.disableButton = false;
      this.errors = [];
    }
    if (this.sampleCollected !== "" && this.collectionDate === ("" as any)) {
      this.disableButton = true;
    }
  }
  public generateSampleId() {
    var samp = "LAB";
    if (this.orderType === 7645) {
      samp = "B";
    } else if (this.orderType === 176742) {
      samp = "H";
    } else if (this.orderType === 885) {
      samp = "P";
    }
    this.clinicLabOrdersResourceService
      .getClinicLabSampleIds({
        user: "admin",
        number: 1,
        sampleType: samp,
      })
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.accessionNumber = res[0].key;
        },
        (error) => {
          console.log("Error");
        }
      );
  }
  public onDateSelectedChange(event) {
    this.errors = [];
    this.disableButton = false;
    if (this.collectionDate !== ("" as any)) {
      this.disableButton = false;
    }
    if (this.sampleCollected === "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
      this.disableButton = false;
    }
    if (this.collectionDate !== ("" as any) && this.sampleCollected === "") {
      this.disableButton = true;
    }
  }
  public closeConfirmationDialog() {
    this.displayConfirmDialog = false;
  }
  public clearSampleCollectedList() {
    this.sampleCollected = "";
    this.collectionDate = "" as any;
    this.errors = [];
    this.displayConfirmDialog = false;
    this.displaySampleDialog = false;
  }
  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 1000);
  }

  private generateLabLabels() {
    const labels = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.labOrders.length; i++) {
      const order = this.labOrders[i];
      if (order.isChecked) {
        for (let c = 0; c < this.copies; c++) {
          const label = this.getLabel(order);
          labels.push(label);
        }
      }
    }
    this.printLabels(labels);
  }

  private printLabels(labels) {
    // this.isPrinting = true;
    // this.labelService.generateBarcodes(labels)
    //   .take(1).subscribe((blobUrl) => {
    //     this.isPrinting = false;
    //     // window.open(blobUrl);
    //   });
  }

  private getCorrespingLabOrdersFromIcimrs(result, uuid) {
    for (let i = 0; i < result.length; i++) {
      if (result[i].orderNumber === uuid) {
        this.currentOrder = null;
        this.displayDialog = true;
        this.currentOrder = result[i];
      }
    }
    return this.currentOrder;
  }

  private selectAll() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.labOrders.length; i++) {
      this.labOrders[i].isChecked = this.allItemsSelected;
    }
  }

  private selectOrder() {
    // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
    for (const labOrder of this.labOrders) {
      if (labOrder.isChecked) {
        this.allItemsSelected = false;
        return;
      }
    }

    // If not the check the "allItemsSelected" checkbox
    this.allItemsSelected = true;
  }
  private toDateString(date: Date): string {
    return Moment(date).utcOffset("+03:00").format();
  }

  private getLabel(order) {
    return {
      orderDate: Moment(order.dateActivated).format("DD-MM-YYYY"),
      testName: order.display,
      identifier: this.patientIdentifer,
      orderNumber: order.orderNumber,
    };
  }
  private generateLabLabel(order) {
    const labels = [];
    for (let c = 0; c < this.copies; c++) {
      const label = this.getLabel(order);
      labels.push(label);
    }
    this.printLabels(labels);
  }
}
