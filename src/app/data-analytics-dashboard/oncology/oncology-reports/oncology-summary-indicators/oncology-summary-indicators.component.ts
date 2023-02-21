import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { take } from "rxjs/operators";
import * as _ from "lodash";
import * as Moment from "moment";

import { OncologySummaryIndicatorsResourceService } from "../../../../etl-api/oncology-summary-indicators-resource.service";
import * as OncologyReportConfig from "../oncology-pdf-reports.json";
import { EventEmitter } from "events";
import { EncounterResourceService } from "src/app/openmrs-api/encounter-resource.service";
import { DataAnalyticsDashboardService } from "src/app/data-analytics-dashboard/services/data-analytics-dashboard.services";
import { AppFeatureAnalytics } from "src/app/shared/app-analytics/app-feature-analytics.service";
@Component({
  selector: "oncology-summary-indicators-summary",
  templateUrl: "./oncology-summary-indicators.component.html",
  styleUrls: ["./oncology-summary-indicators.component.css"],
})
export class OncologySummaryIndicatorsComponent implements OnInit {
  public title = "";
  public monthlySummary: any = [];
  public isPdfReportAvailable = false;
  public params: any;
  public reportType = "";
  public startDate: string = Moment().startOf("year").format("YYYY-MM-DD");
  public endDate: string = Moment().endOf("month").format("YYYY-MM-DD");
  public startAge = 0;
  public endAge = 120;
  public indicators = "";
  public period = "monthly";
  public specificOncologyReport: any;
  public reportUuid = "";
  public reportIndex = 0;
  public report: any;
  public columnDefs: any;
  public currentReport: any;
  public gender: any = ["M", "F"];
  public currentView = "tabular";
  public encounter: any = [];
  public data = [];
  public sectionsDef = [];
  public encounterMap = new Map();
  public encounterTypes: any = [];
  public isAggregated: boolean;
  public selectedIndicators = [];
  public enabledControls =
    "datesControl," + "ageControl,genderControl,locationControl,periodControl";
  public isLoadingReport = false;
  public encounteredError = false;
  public errorMessage = "";
  public reportName = "";
  public dates: any;
  public age: any;
  public selectedGender: any = [];
  public selectedEncounter: any = [];
  public locationUuids: Array<string>;
  public busyIndicator: any = {
    busy: false,
    message: "Please wait...", // default message
  };
  @Output() public selectedTab = new EventEmitter();

  public errorObj = {
    message: "",
    isError: false,
  };

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private oncologySummaryService: OncologySummaryIndicatorsResourceService,
    protected appFeatureAnalytics: AppFeatureAnalytics,
    public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private _encounterResourceService: EncounterResourceService
  ) {}

  public ngOnInit() {
    console.log(this.params);
    this.route.queryParams.subscribe(
      (params) => {
        if (params) {
          this.params = params;
          this.title = params.report;

          if (params.startDate) {
            this.reportUuid = params.reportUuid;
            this.setQueryParams();
            this.fetchReport(this.params);
          }
          this.setReportData(params);
        }
      },
      (error) => {
        console.error("Error", error);
      }
    );
    this.checkIsPdfReportAvailable();
  }

  // public ngAfterViewInit() {
  //   this.cd.detectChanges();
  // }

  public checkIsPdfReportAvailable() {
    const reportTypes: Array<any> = [];
    const reports: Array<any> = OncologyReportConfig.reports;
    reports.forEach((report) => {
      if (this.params.type === report.report_type) {
        this.isPdfReportAvailable = true;
      }
      reportTypes.push(report.report_type);
    });
  }

  public setReportData(params: any) {
    this.reportType = params.type;

    if (params.startDate) {
      this.startDate = params.startDate;
    }

    if (params.endDate) {
      this.endDate = params.endDate;
    }

    if (params.startAge) {
      this.startAge = params.startAge;
    }

    if (params.endAge) {
      this.endAge = params.endAge;
    }

    if (params.period) {
      this.period = params.period;
    }

    this.indicators = params.indicators;

    if (typeof params.gender === "string") {
      const genderArray = [];
      genderArray.push(params.gender);
      this.gender = genderArray;
    } else {
      this.gender = params.gender;
    }
  }

  public navigateToHome() {
    this.router.navigate(["/data-analytics"], {});
  }

  public setQueryParams() {
    this.params = {
      startAge: this.params.startAge,
      endAge: this.params.endAge,
      startDate: this.params.startDate,
      endDate: this.params.endDate,
      gender: this.params.gender,
      period: this.params.period,
      type: this.params.type,
      encounterTypes: this.params.encounterTypes,
      reportUuid: this.params.reportUuid,
      indicators: this.params.indicators,
      reportIndex: this.reportIndex,
      reportName: this.title + " " + "report",
      locationUuids: this.params.locationUuids,
    };
  }

  public getQueryParams() {
    this.setQueryParams();
    return this.params;
  }

  // public generateReport() {
  //   this.getQueryParams();
  // }

  public fetchReport(params) {
    this.loading();
    this.oncologySummaryService
      .getOncologySummaryMonthlyIndicatorsReport(params)
      .pipe(take(1))
      .subscribe(
        (result) => {
          this.monthlySummary = result.result;
          this.columnDefs = result.sectionDefinitions;
          if (result.sectionDefinitions) {
            this.currentView = "tablepdf";
          }
          setTimeout(() => this.endLoading(), 800);
          this.errorObj = {
            isError: false,
            message: "",
          };
        },
        (err) => {
          this.endLoading();
          this.errorObj = {
            isError: true,
            message: err.error.message ? err.error.message : "",
          };
        }
      );
  }

  public loading() {
    this.busyIndicator = {
      busy: true,
      message: "Fetching report...please wait",
    };
  }

  public endLoading() {
    this.busyIndicator = {
      busy: false,
      message: "",
    };
  }

  onTabChanged(event) {
    switch (event.index) {
      case 0:
        this.currentView = "tablepdf";
        break;
      case 1:
        this.currentView = "tabular";
        break;
      case 2:
        this.currentView = "pdf";
        break;
      case 3:
        this.currentView = "tablepdf";
        break;
      default:
        this.currentView = "tabular";
    }
    this.selectedTab.emit(this.currentView);
  }
  public getLocationsSelected() {
    this.dataAnalyticsDashboardService
      .getSelectedMonthlyIndicatorLocations()
      .subscribe((data) => {
        if (data) {
          this.locationUuids = data.locations;
          // console.log(this.route.snapshot);
          this.storeReportParamsInUrl();
        }
      });
  }
  public getEncounterTypes() {
    this._encounterResourceService
      .getEncounterTypes("all")
      .pipe(take(1))
      .subscribe((results) => {
        if (results) {
          this.processEncounterTypes(results);
        }
      });
  }
  public processEncounterTypes(encounterTypes) {
    const encounterTypesArray = [];

    _.each(encounterTypes, (encounterType: any) => {
      const specificEncounterType = {
        id: encounterType.uuid,
        itemName: encounterType.display,
      };
      this.encounterMap.set(encounterType.uuid, specificEncounterType);
      encounterTypesArray.push(specificEncounterType);
    });

    this.encounterTypes = encounterTypesArray;
  }

  public processFilterData(filterChanges: any) {
    if (filterChanges.gender.currentValue) {
      this.formatGenderFilter(filterChanges.gender.currentValue);
    }
    this.getEncounterTypes();
    this.getReportEncounters(this.reportType);
  }

  public formatGenderFilter(genderArray) {
    const selectedGender = [];
    _.each(genderArray, (gender) => {
      selectedGender.push({
        label: gender,
        value: gender,
      });
    });
    this.selectedGender = selectedGender;
  }

  public selectedPeriodChange($event) {
    this.period = $event;
  }

  public generateReport() {
    this.isLoadingReport = true;
    this.getLocationsSelected();
    this.encounteredError = false;
    this.errorMessage = "";
    this.isLoadingReport = false;
  }

  public storeReportParamsInUrl() {
    const urlParams = this.route.snapshot.queryParams;
    this.params = {
      endDate: Moment(this.endDate).format("YYYY-MM-DD"),
      startDate: Moment(this.startDate).format("YYYY-MM-DD"),
      indicators: this.indicators,
      gender: this.gender,
      period: this.period,
      startAge: this.startAge,
      endAge: this.endAge,
      encounterTypes: this.encounter,
      type: this.reportType,
      report: urlParams.report,
      reportIndex: this.reportIndex,
      displayTabluarFilters: true,
      currentView: this.currentView,
      reportUuid: this.reportUuid,
      year_week:
        Moment(this.startDate).format("YYYY-MM-DD") +
        "-" +
        Moment(this.endDate).format("YYYY-MM-DD"),
      locationUuids: this.getSelectedLocations(this.locationUuids),
    };
    // this.router.navigate(['./'], {
    //   queryParams: queryParams,
    //   relativeTo: this.route
    // });
    this.fetchReport(this.params);
  }

  public getSelectedLocations(locationUuids: Array<string>): string {
    if (!locationUuids || locationUuids.length === 0) {
      return "";
    }

    let selectedLocations = "";

    for (let i = 0; i < locationUuids.length; i++) {
      if (i === 0) {
        selectedLocations = selectedLocations + (locationUuids[0] as any).value;
      } else {
        selectedLocations =
          selectedLocations + "," + (locationUuids[i] as any).value;
      }
    }
    return selectedLocations;
  }

  public formatDateField(result) {
    const dates = [];
    for (const item of result) {
      const data = item;
      for (const r in data) {
        if (data.hasOwnProperty(r)) {
          const month = Moment(data.month).format("MMM, YYYY");
          data["reporting_month"] = month;
        }
      }
      dates.push(data);
    }
    return dates;
  }
  public onAgeChangeFinished($event) {
    this.startAge = $event.ageFrom;
    this.endAge = $event.ageTo;
  }

  public getSelectedGender(selectedGender) {
    const gender: any = [];
    _.each(selectedGender, (specGender: any) => {
      if (typeof specGender === "string") {
        gender.push(specGender);
      } else {
        gender.push(specGender.value);
      }
    });
    this.gender = gender;
  }
  public getReportEncounters(reportName) {
    if (reportName === "general-cancer-treatment-numbers") {
      this.selectedEncounter = [
        {
          itemName: "ICIINITIAL",
          id: 204,
          value: "41845242-9400-40d0-a139-4daeb5e89419",
        },
        {
          itemName: "ICIRETURN",
          id: 205,
          value: "669f1ac2-11dc-45b9-af41-282dc12a206a",
        },
      ];
      this.enabledControls =
        "datesControl," + "locationControl,periodControl,encounterControl";
    } else if (reportName === "prostate-cancer-screening-numbers") {
      this.enabledControls = "datesControl," + "locationControl,periodControl";
    }
  }
  public getSelectedEncounter(selectedEncounter) {
    const encounter: any = [];
    _.each(selectedEncounter, (specEncounter: any) => {
      if (typeof specEncounter === "number") {
        this.encounter = encounter;
        encounter.push(specEncounter);
      } else {
        encounter.push(specEncounter.value);
      }
    });
  }

  public getSelectedIndicators(selectedIndicator) {}

  public formatIndicatorsToSelectArray(indicatorParam: string) {
    const arr = indicatorParam.split(",");
    _.each(arr, (indicator) => {
      const text = this.translateIndicator(indicator);
      const id = indicator;

      const data = {
        value: id,
        label: text,
      };
      this.selectedIndicators.push(data.value);
    });
  }

  public translateIndicator(indicator: string) {
    return indicator
      .toLowerCase()
      .split("_")
      .map((word) => {
        return word.charAt(0) + word.slice(1);
      })
      .join(" ");
  }

  public formatGenderToSelectArray(genderParam: string) {
    if (genderParam.length > 1) {
      const arr = genderParam.split(",");
      _.each(arr, (gender) => {
        const id = gender;
        const text = gender === "M" ? "Male" : "Female";
        const data = {
          id: id,
          text: text,
        };
        this.selectedGender.push(data);
      });
    } else {
      const data = {
        id: genderParam,
        text: genderParam === "M" ? "Male" : "Female",
      };
      this.selectedGender.push(data);
    }
  }

  public getLocations($event) {}
}
