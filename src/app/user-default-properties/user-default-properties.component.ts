/* tslint:disable:no-inferrable-types */
import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { UserDefaultPropertiesService } from './user-default-properties.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import {
  RetrospectiveDataEntryService
} from '../retrospective-data-entry/services/retrospective-data-entry.service';
import * as _ from 'lodash';
import { ServicesOfferedProgramsConfigService } from '../etl-api/services-offered-programs-config.service';

@Component({
  selector: 'user-default-properties',
  templateUrl: './user-default-properties.component.html',
  styleUrls: ['./user-default-properties.component.css']
})
export class UserDefaultPropertiesComponent implements OnInit {

  public isBusy: boolean = false;
  public locationRadioButton: boolean = true;
  public query: string = '';
  public user: User;
  public filteredList: Array<any> = [];
  // public departments = [];
  // public selectedDepartment: string = '';
  public medicalServices = [];
  public selectedService: string = '';
  public selectedIdx: number = -1;
  public location: any;
  public confirming: boolean = false;
  public isLoading: boolean = false;
  public locations: Array<any> = [];
  public currentLocation: any;
  public disable = false;
  private retroSettings: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    // private departmentProgramService: DepartmentProgramsConfigService,
    private servicesOfferedPrograms: ServicesOfferedProgramsConfigService,
    private retrospectiveDataEntryService: RetrospectiveDataEntryService,
    private propertyLocationService: UserDefaultPropertiesService
  ) {

  }

  public ngOnInit() {

    this.isBusy = true;
    // if the user is confirming, prefill the current location
    this.route.params.subscribe((params: Params) => {
      if (params['confirm'] !== undefined) {
        this.location = this.retrospectiveDataEntryService.mappedLocation(this.currentLocation);
        this.propertyLocationService.setUserProperty('retroLocation',
          JSON.stringify(this.location));
      }
      this.getServiceOfferedLocations();
    });

  }


  public goToPatientSearch() {
    this.isLoading = true;
    console.log(this.selectedService);
       this.router.navigate(['patient-dashboard/patient-search']);
    // if (this.selectedService === 'SCREENING') {
    // } else if (this.selectedService === 'TREATMENT') {
    //   this.router.navigate(['treatment-dashboard']);
    // }
  }

  // public selectDepartment(event: any) {
  //   const deptObject = _.find(this.departments, (el) => {
  //     return el.itemName === event;
  //   });

  //   const department = [deptObject];
  //   this.selectedDepartment = event;
  //   this.localStorageService.setItem('userDefaultDepartment', JSON.stringify(department));
  // }
  public selectMedicalService(event: any) {
    const servObject = _.find(this.medicalServices, (el) => {
      return el.itemName === event;
    });

    const service = [servObject];
    this.selectedService = event;
    this.localStorageService.setItem('userDefaultServiceOffered', JSON.stringify(service));
  }
  public enableSearchLocation() {
    this.locationRadioButton = false;
  }

  public selectLocation(item: any, locationRadio: boolean) {
    this.locationRadioButton = locationRadio;
    this.disable = false;
    const location = JSON.stringify({ uuid: item.value, display: item.label });
    this.currentLocation = location;
    this.propertyLocationService.setUserProperty('userDefaultLocation', location);
    this.propertyLocationService.setUserProperty('retroLocation', JSON.stringify(item));
  }

  private getServiceOfferedLocations() {
    // this.currentLocation = this.propertyLocationService.getCurrentUserDefaultLocationObject();
    // if (!this.currentLocation) {
    //   this.disable = true;
    // }
    // this.setLocation();
    this.servicesOfferedPrograms.getserviceOfferedProgramsConfig().pipe(take(1)).subscribe((results) => {
      if (results) {
        this.mapServicesOffered(results);
        this.setLocation();
      }
      this.currentLocation = this.propertyLocationService.getCurrentUserDefaultLocationObject();
      if (!this.currentLocation) {
        this.disable = true;
      }
    });
  }

  private setLocation() {
    this.propertyLocationService.getLocations().pipe(take(1)).subscribe((response) => {
      this.locations = response.results.map((location: any) => {
        if (location && !_.isNil(location.display)) {
          return this.retrospectiveDataEntryService.mappedLocation(location);
        }
      });
      this.isBusy = false;
      this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
        this.retroSettings = retroSettings;
      });
    });
  }
    private mapServicesOffered(results: any[]) {
    _.each(results, (service, key: string) => {
      const srvce = {
        'itemName': service.name,
        'id': key
      };
      this.medicalServices.push(srvce);
      this.medicalServices = _.filter(this.medicalServices, (ser) => {
        return !_.includes(['uud4', 'uud5'], ser.id);
      });
    });
  }

}
