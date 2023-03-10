import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { dashboardRouting } from './main-dashboard-routing';
import { MainDashboardComponent } from './main-dashboard.component';
import { UserDefaultPropertiesModule } from '../user-default-properties/';
import { AgGridModule } from 'ag-grid-angular/main';
import {
  LabOrderSearchModule
} from '../lab-order-search';
import {
  UsefulLinksModule
} from '../useful-links';
import { DataListsModule } from '../shared/data-lists/data-lists.module';
import { PatientDashboardModule } from '../patient-dashboard/patient-dashboard.module';
import { NgicimrsSharedModule } from '../shared/ngicimrs-shared.module';
import { MainDashboardGuard } from './main-dashboard.guard';
import { UserService } from '../openmrs-api/user.service';
import { AppState } from '../app.service';
import { CohortResourceService } from '../openmrs-api/cohort-resource.service';
import { CohortMemberResourceService } from '../openmrs-api/cohort-member-resource.service';
import { MOTDNotificationComponent } from './../Motd/motd-notification.component';
import { MOTDNotificationService } from './../etl-api/motd.notification.service';
import { CookieService } from 'ngx-cookie';
import { DataAnalyticsModule } from '../data-analytics-dashboard/data-analytics.module';
import { CacheModule } from 'ionic-cache';
import { NavigationModule } from '../navigation';
import { RetrospectiveDataEntryModule
} from '../retrospective-data-entry/retrospective-data-entry.module';
import { TreatmentDashboardModule } from '../treatment-dashboard/treatment-dashboard.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    dashboardRouting,
    NavigationModule,
    NgicimrsSharedModule,
    AgGridModule.withComponents([]),
    DataListsModule,
    LabOrderSearchModule,
    TreatmentDashboardModule,
    UsefulLinksModule,
    UserDefaultPropertiesModule,
    RetrospectiveDataEntryModule
  ],
  declarations: [
    MainDashboardComponent,
    MOTDNotificationComponent,
  ],
  providers: [
    MainDashboardGuard,
    UserService,
    AppState,
    CohortResourceService,
    CohortMemberResourceService,
    MOTDNotificationService,
    CookieService
  ],
  exports: [
    MainDashboardComponent
  ]
})
export class MainDashboardModule { }
