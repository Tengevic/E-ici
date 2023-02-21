import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import * as _ from "lodash";
import * as Moment from "moment";
import { take } from "rxjs/operators";

import { AppFeatureAnalytics } from "../../../../shared/app-analytics/app-feature-analytics.service";
import { DataAnalyticsDashboardService } from "../../../services/data-analytics-dashboard.services";
import { EncounterResourceService } from "src/app/openmrs-api/encounter-resource.service";
import { url } from "inspector";

@Component({
  selector: "oncology-summary-filters",
  templateUrl: "./oncology-summary-filters.component.html",
  styleUrls: ["./oncology-summary-filters.component.css"],
})
export class OncologySummaryFiltersComponent implements OnInit {
  @Input() public startDate;
  @Input() public endDate;
  @Input() public reportType = "";
  @Input() public indicators = "";
  @Input() public ageRangeStart: number;
  @Input() public ageRangeEnd: number;
  @Input() public reportIndex: number;
  @Input() public reportUuid: number;
  @Input() public period = "";
  @Input() public gender: any = [];
  public encounter: any = [];
  public title = "Filters";
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
  public monthlySummary: any = [];
  // public gender: Array<string>;

  constructor(
    protected appFeatureAnalytics: AppFeatureAnalytics,
    public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private router: Router,
    private _encounterResourceService: EncounterResourceService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    console.log(this.route.snapshot);
    const urlParams: any = this.route.snapshot.queryParams;
    const queryParams = {
      type: urlParams.type,
      report: urlParams.report,
    };
    this.router.navigate(["./"], {
      queryParams: queryParams,
      relativeTo: this.route,
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    this.processFilterData(changes);
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
    this.route.data.subscribe((report) => {});
    const queryParams = {
      endDate: Moment(this.endDate).format("YYYY-MM-DD"),
      startDate: Moment(this.startDate).format("YYYY-MM-DD"),
      indicators: this.indicators,
      gender: this.gender,
      period: this.period,
      startAge: this.ageRangeStart,
      endAge: this.ageRangeEnd,
      encounterTypes: this.encounter,
      type: this.reportType,
      report: urlParams.report,
      reportIndex: this.reportIndex,
      reportUuid: this.reportUuid,
      locationUuids: this.getSelectedLocations(this.locationUuids),
    };

    console.log("test BALAA TEST");
    this.router.navigate(["./"], {
      queryParams: queryParams,
      relativeTo: this.route,
    });
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
    this.ageRangeStart = $event.ageFrom;
    this.ageRangeEnd = $event.ageTo;
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
