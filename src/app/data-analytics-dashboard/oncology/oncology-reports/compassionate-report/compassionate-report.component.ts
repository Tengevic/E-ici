import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import * as Moment from "moment";

@Component({
  selector: "app-compassionate-report",
  templateUrl: "./compassionate-report.component.html",
  styleUrls: ["./compassionate-report.component.css"],
})
export class CompassionateReportComponent implements OnInit {
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

  constructor() {}

  ngOnInit() {}
}
