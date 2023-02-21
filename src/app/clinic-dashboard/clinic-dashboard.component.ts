
import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

import { LocationResourceService } from '../openmrs-api/location-resource.service';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';
import { UserDefaultPropertiesService } from '../user-default-properties/user-default-properties.service';
import { LocalStorageService } from '../utils/local-storage.service';
@Component({
  selector: 'clinic-dashboard',
  templateUrl: 'clinic-dashboard.component.html'
})
export class ClinicDashboardComponent implements OnInit {

  public locationUuid: string;
  public loaderStatus: boolean;
  public locations = [];
  public selectedLocation: any = {};
  public selectingLocation = true;
  public selectedDepartment: any;
  public selectedServiceOffered: any;
  public showLocationFilter = true;

  constructor(private locationResourceService: LocationResourceService,
    private route: ActivatedRoute, private router: Router,
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private userDefaultProperties: UserDefaultPropertiesService,
    private localStorageService: LocalStorageService
  ) {
    this.loaderStatus = false;
  }

  public ngOnInit() {
    this.hideShowLocationFilter();
    this.getUserServiceOffering();
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event) => {
        this.hideShowLocationFilter();
      });
  }

  // public getUserDepartment() {
  //   let department = this.localStorageService.getItem('userDefaultDepartment');
  //   if (department === '[""]') {
  //     department = 'HEMATO-ONCOLOGY';
  //   }
  // if (!department) {
  //   this.router.navigate(['/user-default-properties']);
  // }
  //   this.selectedDepartment = JSON.parse(department);
  // }
  public getUserServiceOffering() {
    let service = this.localStorageService.getItem('userDefaultServiceOffered');
    console.log('service', service);
    if (service === '[""]') {
      service = 'screening';
    }
    if (!service) {
      this.router.navigate(['/user-default-properties']);
    }
    this.selectedServiceOffered = JSON.parse(service);
    this.getLocations();
  }

  public hideShowLocationFilter() {
    // const currentUrl = this.router.url;
    // let isHivViz = 1;
    // if (currentUrl) {
    //   isHivViz = currentUrl.indexOf('hiv-viz');
    // }
    // if (isHivViz === -1) {
    //   this.showLocationFilter = true;
    // } else {
    //   this.showLocationFilter = false;
    // }
    this.showLocationFilter = true;
  }

  public getLocations() {
    this.loaderStatus = true;
    this.locationResourceService.getLocations().pipe(take(1)).subscribe((results: any) => {
      this.locations = results.map((location) => {
        return {
          value: location.uuid,
          label: location.display
        };
      });

      this.route.params.subscribe((params) => {
        setTimeout(() => {
          console.log(params);
          this.locationUuid = params['location_uuid'];
          if (this.locationUuid) {
            this.resolveSelectedLocationByUuid(this.locationUuid);
            if (this.selectedLocation && this.selectedLocation !== {}) {
              this.selectingLocation = false;
            }
          } else {
            const userLocation = this.userDefaultProperties.getCurrentUserDefaultLocationObject();
            const medicalService = this.selectedServiceOffered.length > 0 ?
            this.selectedServiceOffered[0].itemName.toLowerCase() : 'general';
            this.router.navigate(['/clinic-dashboard', userLocation.uuid,
            medicalService, 'daily-schedule']);
          }
        });
      });
      this.loaderStatus = false;
    }, (error) => {
      this.loaderStatus = false;
      console.error(error);
    });
  }

  public locationChanged($event) {
    if ($event && $event.value !== this.locationUuid) {
      const splitUrl = this.router.routerState.snapshot.url.split('/');
      splitUrl[2] = $event.value;
      this.clinicDashboardCacheService.clear();
      this.router.navigateByUrl(splitUrl.join('/'));
    }
  }

  public resolveSelectedLocationByUuid(locationUuid: string) {
    for (let i = 0; i < this.locations.length; i++) {
      if (this.locations[i].value === locationUuid) {
        this.selectedLocation = this.locations[i];
        break;
      }
    }
  }

}
