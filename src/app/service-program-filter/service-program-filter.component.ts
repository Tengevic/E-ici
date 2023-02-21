import { take } from "rxjs/operators";
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import * as Moment from "moment";
import { LocationResourceService } from "../openmrs-api/location-resource.service";
import { ClinicDashboardCacheService } from "src/app/clinic-dashboard/services/clinic-dashboard-cache.service";
import { ServicesOfferedProgramsConfigService } from "./../etl-api/services-offered-programs-config.service";
import { LocalStorageService } from "src/app/utils/local-storage.service";

@Component({
  selector: "app-service-program-filter",
  templateUrl: "./service-program-filter.component.html",
  styleUrls: ["./service-program-filter.component.css"],
})
export class ServiceProgramFilterComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public selectedProgram: string;
  public programs: Array<any> = [];
  public eiciServiceProgramConfig: any = [];
  public currentEiciService = "";
  public defaultLocation = "";
  public programVisitsConfig: any[];
  public selectedProgramType: any = [];
  public program: any = [];
  public eiciServicePrograms: any;
  public programMap = new Map();
  public eiciService: any = [];
  public eiciServiceMap = new Map();
  public countyMap = new Map();
  public filterSet = false;
  public eiciServices: any = [];
  public showSelectedPrograms = true;
  public trackPrograms: any = [];
  public selectedStartDate: string = Moment()
    .startOf("month")
    .format("YYYY-MM-DD");
  public selectedEndDate: string = Moment().endOf("month").format("YYYY-MM-DD");
  public params: any = {
    startDate: this.selectedStartDate,
    endDate: this.selectedEndDate,
    locationUuids: [],
    programType: [],
    department: [],
  };
  public dropdownSettings: any = {
    singleSelection: false,
    enableCheckAll: true,
    text: "Select or enter to search",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
  };
  public showFilters = true;
  public locationDropdownSettings: any = {
    enableCheckAll: false,
    singleSelection: false,
    text: "Select or enter to search",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
  };
  public programDropdownSettings: any = {
    singleSelection: false,
    enableCheckAll: true,
    text: "Select or enter to search",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
    badgeShowLimit: 10,
  };
  public countyDropdownSettings: any = {
    enableCheckAll: false,
    singleSelection: true,
    text: "Select or enter to search",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    enableSearchFilter: true,
  };
  public loadingFilters = true;
  public locations: any = [];
  public location: any = [];
  public multipleLocationsSelected = false;
  public locationMap = new Map();
  public county: any = [];
  public counties: any = [];
  public selectedLocation: any = [];
  public selectedFiltersOkay = true;
  public errorMsg: any = {
    status: false,
    message: "",
  };
  public subscriptionsArray = [];

  public showEiciServiceFilter = true;

  @Output() public filterSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() public filterReset: EventEmitter<boolean> = new EventEmitter<any>();

  constructor(
    private cd: ChangeDetectorRef,
    private _locationResourceService: LocationResourceService,
    private _ServicesOfferedProgramsConfigService: ServicesOfferedProgramsConfigService,
    private _clinicDashboardCacheService: ClinicDashboardCacheService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit() {
    this.showHideEiciService().then((success) => {
      this.loadAllFilterParams().then((result) => {
        this.loadingFilters = false;
        this.route.queryParams.subscribe(
          (params) => {
            if (params) {
              this.params = params;
              // cater for endpoints taking long to return data
              setTimeout(() => {
                this.loadFilterFromUrlParams(params);
              }, 1000);
            }
          },
          (error) => {
            console.error("Error", error);
          }
        );
      });
    });
  }

  public showHideEiciService() {
    return new Promise((resolve, reject) => {
      const currentUrl = this.router.url;
      let isClinicDashboard = -1;
      if (currentUrl) {
        isClinicDashboard = currentUrl.indexOf("clinic-dashboard");
      }
      if (isClinicDashboard === -1) {
        this.showEiciServiceFilter = true;
        this.getEiciServiceConfig().then((success) => {});
      } else {
        this.showEiciServiceFilter = false;
        this.getEiciServiceConfig();
        //  if clinic dashboard do not show eiciServices only programs
        this.getDefaultEiciService();
      }

      resolve("success");
    });
  }

  public getSelectedLocation() {
    const sub = this._clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((clinic) => {
        if (clinic) {
          this.defaultLocation = clinic;
          const locations = this.loadFilterFromMap(clinic, this.locationMap);
          this.location = locations;
        }
      });

    this.subscriptionsArray.push(sub);
  }

  public loadFilterFromUrlParams(params) {
    const newParams: any = {
      startDate: "",
      endDate: "",
      locationUuids: [],
      programType: [],
    };

    if (params.endDate) {
      if (params.locationUuids) {
        this.location = [];
        const locations = this.loadFilterFromMap(
          params.locationUuids,
          this.locationMap
        );
        this.location = locations;
        newParams.locationUuids = params.locationUuids;
      } else {
        newParams.locationUuids = [];
      }
      if (params.endDate) {
        this.selectedEndDate = params.endDate;
        newParams.endDate = this.params.endDate;
      } else {
        newParams.endDate = this.selectedEndDate;
      }
      if (params.eiciService) {
        this.eiciService = [];
        const eiciServiceTypes = this.loadFilterFromMap(
          params.eiciService,
          this.eiciServiceMap
        );
        this.eiciService = eiciServiceTypes;
        let deptArray = [];
        if (this.isString(params.eiciService)) {
          deptArray = params.eiciService.split(",");
        } else {
          deptArray = params.eiciService;
        }
        this.getProgramsFromDeptArray(deptArray);
      }
      if (params.programType) {
        this.program = [];
        const programTypes = this.loadFilterFromMap(
          params.programType,
          this.programMap
        );
        if (this.showSelectedPrograms) {
          this.program = programTypes;
        }
        newParams.programType = params.programType;
      } else {
        newParams.programType = [];
      }

      this.emitParams(newParams);
    } else {
      // if no params is set load default location
      this.getSelectedLocation();
    }
  }

  public isString(value) {
    if (typeof value === "string") {
      return true;
    } else {
      return false;
    }
  }

  public loadFilterFromMap(values: any, map) {
    const filterArray = [];
    if (this.isString(values)) {
      const selectedType = map.get(values);
      filterArray.push(selectedType);
    } else {
      for (const value of values) {
        const selectedType = map.get(value);
        filterArray.push(selectedType);
      }
    }
    return filterArray;
  }

  public getDefaultEiciService() {
    const defaultEiciService: any = JSON.parse(
      this.localStorageService.getItem("userDefaultServiceOffered")
    );
    if (defaultEiciService) {
      this.currentEiciService = defaultEiciService[0].itemName;
      this.getEiciServicePrograms(defaultEiciService[0].itemName);
    }
  }

  public getEiciServicePrograms(eiciService) {
    const programs = [];

    this._ServicesOfferedProgramsConfigService
      .getServicePrograms(eiciService)
      .pipe(take(1))
      .subscribe((result) => {
        this.eiciServicePrograms = result;
        this.programs = result.map((program: any) => {
          const specificProgram = {
            id: program.uuid,
            itemName: program.name,
          };
          this.programMap.set(program.uuid, specificProgram);
          return specificProgram;
        });
      });
  }

  public getEiciServiceConfig() {
    return new Promise((resolve, reject) => {
      this._ServicesOfferedProgramsConfigService
        .getserviceOfferedProgramsConfig()
        .pipe(take(1))
        .subscribe((results) => {
          if (results) {
            this.eiciServiceProgramConfig = results;
            this.loadAllEiciServices();
            resolve("sucesss");
          }
        });
    });
  }

  public loadAllEiciServices() {
    const eiciServices = [];

    _.each(this.eiciServiceProgramConfig, (eiciService: any, index) => {
      const specificDept = {
        itemName: eiciService.name,
        id: index,
      };
      eiciServices.push(specificDept);
      this.eiciServiceMap.set(index, specificDept);
    });

    this.eiciServices = eiciServices;
  }

  public loadProgramsAndEiciServices() {
    const eiciServices = [];
    const programs = [];

    _.each(this.eiciServiceProgramConfig, (eiciService: any, index) => {
      if (eiciService.name === this.currentEiciService) {
        const specificDept = {
          itemName: eiciService.name,
          id: index,
        };
        eiciServices.push(specificDept);
        this.eiciServiceMap.set(index, specificDept);
        _.each(eiciService.programs, (serveProgram: any) => {
          const specificProgram = {
            itemName: serveProgram.name,
            id: serveProgram.uuid,
          };
          programs.push(serveProgram.uuid, specificProgram);
          this.programMap.set(serveProgram.uuid, specificProgram);
        });
      }
    });

    this.programs = programs;
    this.eiciServices = eiciServices;
  }

  public loadAllFilterParams() {
    return new Promise((resolve, reject) => {
      this.getAllLocations().then((success) => {
        resolve("Success");
      });
    });
  }

  public getAllLocations() {
    return new Promise((resolve, reject) => {
      this._locationResourceService
        .getLocations()
        .pipe(take(1))
        .subscribe((location) => {
          if (location) {
            this.setLocations(location);
            resolve("success");
          }
        });
    });
  }

  public getProgramsFromDeptArray(eiciServices) {
    const programs = [];
    _.each(this.eiciServiceProgramConfig, (eiciService: any, index) => {
      const eiciServiceProgs = eiciService.programs;
      _.each(eiciServiceProgs, (program) => {
        const specificProgram = {
          itemName: program.name,
          id: program.uuid,
        };
        if (eiciServices.indexOf(index) !== -1) {
          programs.push(specificProgram);
        }
        this.programMap.set(program.uuid, specificProgram);
      });
    });

    this.programs = programs;
  }

  public setLocations(locations) {
    const locationsArray: any = [];
    const countiesArray: any = [];
    const trackCounty: any = [];
    let countyNo = 1;
    _.each(locations, (location: any) => {
      const specificCountyObj: any = {
        id: countyNo,
        itemName: location.stateProvince,
      };
      const specificLocation: any = {
        id: location.uuid,
        itemName: location.display,
      };
      if (location.stateProvince !== "") {
        this.locationMap.set(location.uuid, specificLocation);
        this.setCounties(specificCountyObj.itemName, specificLocation);
        locationsArray.push(specificLocation);
        if (_.includes(trackCounty, specificCountyObj.itemName) === false) {
          countiesArray.push(specificCountyObj);
          trackCounty.push(specificCountyObj.itemName);
        }
        countyNo++;
      }
    });
    this.locations = locationsArray;
    this.counties = _.uniq(countiesArray);
  }

  public setCounties(county, location) {
    const countySavedObj: any = this.countyMap.get(county);
    if (typeof countySavedObj === "undefined") {
      const countyLocations = [];
      countyLocations.push(location);
      this.countyMap.set(county, countyLocations);
    } else {
      const countyLocations = countySavedObj;
      countyLocations.push(location);
      this.countyMap.set(county, countyLocations);
    }
  }

  public emitParams(params) {
    this.filterSelected.emit(params);
  }
  public setFilter() {
    this.filterSet = true;
    const isFilterOkay = this.validateFilterSelected();
    if (isFilterOkay === true) {
      this.setParams();
    } else {
      this.selectedFiltersOkay = false;
    }
    this.filterSet = false;
  }

  public setParams() {
    const startDate = Moment(this.selectedStartDate).format("YYYY-MM-DD");
    const endDate = Moment(this.selectedEndDate).format("YYYY-MM-DD");
    const programUuids = [];
    const eiciServiceUuid = [];

    if (this.eiciService.length > 0 && this.program.length === 0) {
      this.showSelectedPrograms = false;
      _.each(this.programs, (program: any) => {
        programUuids.push(program.id);
      });
      _.each(this.eiciService, (eiciService: any) => {
        eiciServiceUuid.push(eiciService.id);
      });
    } else if (this.eiciService.length > 0 && this.program.length > 0) {
      this.showSelectedPrograms = true;
      _.each(this.program, (program: any) => {
        programUuids.push(program.id);
      });
      _.each(this.eiciService, (eiciService: any) => {
        eiciServiceUuid.push(eiciService.id);
      });
    } else if (this.eiciService.length === 0 && this.program.length > 0) {
      this.showSelectedPrograms = true;
      _.each(this.program, (program: any) => {
        programUuids.push(program.id);
      });
    } else if (this.eiciService.length === 0 && this.program.length === 0) {
      this.showSelectedPrograms = false;
      _.each(this.programs, (program: any) => {
        programUuids.push(program.id);
      });
    } else {
      this.showSelectedPrograms = false;
    }
    // get location ids
    const locationUuids = [];
    _.each(this.location, (locationItem: any) => {
      locationUuids.push(locationItem.id);
    });

    this.params = {
      startDate: startDate,
      endDate: endDate,
      locationUuids: locationUuids,
      programType: programUuids,
    };
    // only add eiciService if it has been selected
    if (eiciServiceUuid.length > 0) {
      this.params["eiciService"] = eiciServiceUuid;
    }

    this.passParamsToUrl(this.params);
  }

  public validateFilterSelected() {
    this.errorMsg = { status: false, message: "" };
    if (this.selectedEndDate === null) {
      this.selectedEndDate = Moment().endOf("month").format("YYYY-MM-DD");
    }
    return true;
  }
  public collapseFilters() {
    this.showFilters = false;
  }
  public expandFilters() {
    this.showFilters = true;
  }
  public getSelectedStartDate($event) {
    this.selectedStartDate = $event;
    this.filterSet = false;
  }
  public getSelectedEndDate($event) {
    this.selectedEndDate = $event;
    this.filterSet = false;
  }

  public selectEiciService(eiciService) {
    this.filterSet = false;
    const eiciServicesSelected = this.eiciService;
    this.programs = [];
    this.trackPrograms = [];
    _.each(eiciServicesSelected, (eiciServicesSelected: any) => {
      this.getPrograms(eiciServicesSelected);
    });
    this.cd.detectChanges();
  }
  public onSelectAllEiciServices($event) {
    this.filterSet = false;
    this.selectEiciService($event);
  }
  public onDeSelectAllEiciService($event) {
    this.filterSet = false;
  }
  public programDeSelect($event) {
    this.filterSet = false;
  }
  public selectCounty($event) {
    this.filterSet = false;
    this.multipleLocationsSelected = true;
    this.loadLocationsFromCounty($event.itemName);
  }
  public loadLocationsFromCounty(county) {
    const countyLocations = this.countyMap.get(county);
    this.location = [];
    _.each(countyLocations, (countyLocation) => {
      this.location.push(countyLocation);
    });
  }
  public countyDeselect($event) {
    this.removeCountyLocations($event.itemName);
    this.multipleLocationsSelected = false;
  }
  public removeCountyLocations(county) {
    const countyLocations = this.countyMap.get(county).reverse();
    _.each(countyLocations, (countyLocation: any) => {
      const locationId = countyLocation.id;
      _.each(this.location, (location: any, index) => {
        const selectedLocationId = location.id;
        if (selectedLocationId === locationId) {
          this.location.splice(index, 1);
        }
      });
    });
  }
  public selectLocation($event) {
    this.filterSet = false;
    this.multipleLocationsSelected = true;
    this.county = [];
  }
  public locationDeselect($event) {
    this.filterSet = false;
    if (this.location.length === 0) {
      this.multipleLocationsSelected = false;
    }
  }
  public onSelectAllLocations($event) {
    this.filterSet = false;
  }
  public onDeSelectAllLocations($event) {
    this.filterSet = false;
  }
  public selectProgram($event) {
    this.filterSet = false;
  }
  public resetFilter() {
    this.initializeParams();
    this.eiciService = [];
    this.errorMsg = {
      status: false,
      message: "",
    };
    this.program = [];
    this.county = [];
    this.location = [];
    this.filterReset.emit(true);
    this.filterSet = false;
  }
  public initializeParams() {
    this.selectedStartDate = Moment().startOf("month").format("YYYY-MM-DD");
    this.selectedEndDate = Moment().endOf("month").format("YYYY-MM-DD");
    this.selectedProgramType = [];
    this.selectedProgramType = [];
    this.params = {
      startDate: this.selectedStartDate,
      endDate: this.selectedEndDate,
      locationUuids: [],
      programType: [],
    };
  }
  public resetLocationSelected() {
    this.multipleLocationsSelected = false;
    this.location = [];
  }
  public selectAllLocations() {
    this.multipleLocationsSelected = true;
    this.location = [];
  }

  public eiciServiceDeselect($event) {
    const eiciServiceUuid = $event.id;
    const eiciServicePrograms = [];

    _.each(this.eiciServiceProgramConfig, (eiciService: any, index) => {
      if (index === eiciServiceUuid) {
        _.each(eiciService.programs, (deptProgram: any) => {
          eiciServicePrograms.push(deptProgram.uuid);
        });
      }
    });

    this.removeProgramTypes(eiciServicePrograms);

    this.filterSet = false;

    this.cd.detectChanges();
  }

  public removeProgramTypes(programUuids) {
    for (let i = this.programs.length - 1; i >= 0; i--) {
      const programUuid = this.programs[i].id;
      if (_.includes(programUuids, programUuid) === true) {
        this.programs.splice(i, 1);
      } else {
      }
    }

    for (let i = this.program.length - 1; i >= 0; i--) {
      const programUuid = this.program[i].id;

      if (_.includes(programUuids, programUuid) === true) {
        this.program.splice(i, 1);
      }
    }
  }

  public passParamsToUrl(params) {
    const navigationData = {
      queryParams: params,
      replaceUrl: true,
    };

    const currentUrl = this.router.url;
    const routeUrl = currentUrl.split("?")[0];
    this.router.navigate([routeUrl], navigationData);
    this.filterSet = false;
  }

  public getPrograms(eiciServiceSelected) {
    const eiciServices = this.eiciServiceProgramConfig;
    this.trackPrograms = [];
    _.each(eiciServices, (eiciService: any, index) => {
      if (eiciService.name === eiciServiceSelected.itemName) {
        const eiServPrograms = eiciService.programs;
        _.each(eiServPrograms, (program: any) => {
          const specificProgram = { id: program.uuid, itemName: program.name };
          if (_.includes(this.trackPrograms, program.uuid) === false) {
            this.programs.push(specificProgram);
            this.trackPrograms.push(program.uuid);
          }
        });
      }
    });
  }

  public ngOnDestroy() {
    this.subscriptionsArray.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  public onSelectAllPrograms($event) {}

  public ngAfterViewInit() {}
}
