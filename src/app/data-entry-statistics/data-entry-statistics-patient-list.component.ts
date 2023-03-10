import { take } from "rxjs/operators";
import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import * as _ from "lodash";
import { DataEntryStatisticsService } from "./../etl-api/data-entry-statistics-resource.service";
import { GridOptions } from "ag-grid/main";
import { UserService } from "../openmrs-api/user.service";
@Component({
  selector: "data-entry-statistics-patient-list",
  templateUrl: "./data-entry-statistics-patient-list.component.html",
  styleUrls: ["./data-entry-statistics-patient-list.component.css"],
})
export class DataEntryStatisticsPatientListComponent
  implements OnInit, AfterViewInit {
  public title = "Patient List";
  // tslint:disable-next-line: max-line-length
  private downloadReportPriviledge = [
    "ccb03fce-fc9a-473d-b158-6db5b53d4302",
    "93df77a2-24db-11ea-9448-0242ac150002",
    "324745b3-5259-4172-bd05-b9d57f51eb9e",
  ];
  public busyIndicator: any = {
    busy: false,
    message: "Please wait...", // default message
  };

  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    onGridSizeChanged: () => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    onGridReady: () => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
  };

  public rowData: any = [];

  @Input() public patientList: any = [];
  @Input() public startDate = "";
  @Input() public endDate = "";

  public dataEntryPatientListColdef: any = [
    {
      headerName: "#",
      field: "patient_no",
    },
    {
      headerName: "Identifiers",
      field: "identifiers",
      onCellClicked: (column) => {
        this.redirectTopatientInfo(column.data.patient_uuid);
      },
      cellRenderer: (column) => {
        return (
          '<a href="javascript:void(0);" title="Identifiers">' +
          column.value +
          "</a>"
        );
      },
    },
    {
      headerName: "Person Name",
      field: "person_name",
    },
    {
      headerName: "Gender",
      field: "gender",
    },
    {
      headerName: "Age",
      field: "age",
    },
    {
      headerName: "Location Name",
      field: "location_name",
    },
    {
      headerName: "Phone Number",
      width: 150,
      field: "phone_number",
    },
    {
      headerName: "Latest Appointment",
      width: 200,
      field: "last_appointment",
    },
    {
      headerName: "Latest RTC Date",
      width: 150,
      field: "latest_rtc_date",
    },
    {
      headerName: "Nearest Center",
      width: 150,
      field: "nearest_center",
    },
  ];

  constructor(
    private _cd: ChangeDetectorRef,
    public _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
    private userService: UserService,
    public _dataEntryStatisticsService: DataEntryStatisticsService
  ) {}

  public ngOnInit() {
    this.checkReportDownloadPriviledge();
    this._route.queryParams.subscribe(
      (params) => {
        if (params) {
          this.getPatientList(params);
        }
      },
      (error) => {
        console.error("Error", error);
      }
    );
  }

  public ngAfterViewInit(): void {
    this._cd.detectChanges();
  }
  public checkReportDownloadPriviledge() {
    const privileges: any[] = this.userService.getLoggedInUser().privileges;
    console.log(privileges);
    let authorized = false;
    if (privileges === null) {
      authorized = true;
    } else {
      _.forEach(privileges, (privilege) => {
        _.forEach(this.downloadReportPriviledge, (allowedPrivilege) => {
          if (allowedPrivilege === privilege.uuid) {
            authorized = true;
          }
        });
        if (authorized) {
          return false;
        }
      });
    }
  }
  public processPatientList(patientList) {
    const patientArray = [];
    let patientCount = 1;

    _.each(patientList, (list: any) => {
      const specificPatient = {
        patient_no: patientCount,
        identifiers: list.identifiers,
        person_name: list.person_name,
        gender: list.gender,
        age: list.age,
        location_name: list.location_name,
        patient_uuid: list.patient_uuid,
        phone_number: list.phone_number,
        last_appointment: list.last_appointment,
        latest_rtc_date: list.latest_rtc_date,
        cur_meds: list.cur_meds,
        latest_vl: list.latest_vl,
        latest_vl_date: list.latest_vl_date,
        previous_vl: list.previous_vl,
        previous_vl_date: list.previous_vl_date,
        nearest_center: list.nearest_center,
      };

      patientArray.push(specificPatient);
      patientCount++;
    });

    this.rowData = patientArray;
  }

  public redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this._router.navigate([
      "/patient-dashboard/patient/" +
        patientUuid +
        "/general/general/landing-page",
    ]);
  }

  public getPatientList(params) {
    this.patientList = [];
    this.busyIndicator = {
      busy: true,
      message: "Fetching patient list..please wait",
    };
    this._dataEntryStatisticsService
      .getDataEntrySatisticsPatientList(params)
      .pipe(take(1))
      .subscribe((results) => {
        if (results) {
          this.processPatientList(results);
          this.busyIndicator = {
            busy: false,
            message: "",
          };
        }
      });
  }

  public back() {
    this._location.back();
  }
  public exportPatientListToCsv() {
    this.gridOptions.api.exportDataAsCsv();
  }
}
