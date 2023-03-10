import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';

import { SharedModule, ConfirmDialogModule, DialogModule, MessagesModule,
TabViewModule, PanelModule
} from 'primeng/primeng';
import { NgSelectModule } from '@ng-select/ng-select';
import { routes } from './patient-dashboard.routes';
import { PatientDashboardGuard } from './patient-dashboard.guard';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { ProgramService } from './programs/program.service';
import { PatientSearchService } from '../patient-search/patient-search.service';
import { PatientService } from './services/patient.service';
import { PatientPreviousEncounterService } from './services/patient-previous-encounter.service';
import { LabOrderSearchModule } from '../lab-order-search/lab-order-search.module';
import { PatientRoutesFactory } from '../navigation';
import { PatientDashboardCommonModule } from './common/patient-dashboard.common.module';
import { PatientDashboardHivModule } from './hiv/patient-dashboard-hiv.module';
import { PatientSearchModule } from '../patient-search/patient-search.module';
import { PatientProgramService } from './programs/patient-programs.service';
import { NgicimrsSharedModule } from '../shared/ngicimrs-shared.module';
import { PatientDashboardCdmModule } from './cdm/patient-dashboard-cdm.module';
import { PatientDashboardOncologyModule } from './oncology/patient-dashboard-oncology.module';
import {
  PatientDashboardDermatologyModule } from './dermatology/patient-dashboard-dermatology.module';
import { DepartmentProgramsConfigService } from '../etl-api/department-programs-config.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { PatientDashboardResolver } from './services/patient-dashboard.resolver';
import { ProgramManagerModule
} from '../program-manager/program-manager.module';
import { GroupEnrollmentModule } from './group-enrollment/group-enrollment.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PocHttpInteceptor } from '../shared/services/poc-http-interceptor';
import { GeneralLandingPageComponent } from './general-landing-page/landing-page.component';
import { PatientRegistrationModule } from '../patient-creation/patient-creation.module';
import { PatientDashboardHomeComponent } from './patient-dashboard-home/patient-dashboard-home.component';
import { HivSummaryLatestComponent } from './hiv/hiv-summary/hiv-summary-latest.component';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    FormsModule,
    PatientRegistrationModule,
    ConfirmDialogModule,
    SharedModule,
    DialogModule,
    MessagesModule,
    TabViewModule,
    PanelModule,
    LabOrderSearchModule,
    NgicimrsSharedModule,
    NgSelectModule,
    PatientDashboardCdmModule,
    PatientDashboardOncologyModule,
    PatientDashboardCommonModule,
    PatientDashboardHivModule,
    PatientDashboardDermatologyModule,
    PatientSearchModule,
    ProgramManagerModule,
    GroupEnrollmentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PatientDashboardComponent,
    GeneralLandingPageComponent,
    PatientDashboardHomeComponent
  ],
  exports: [
  ],
  providers: [
    PatientDashboardGuard,
    PatientSearchService,
    PatientDashboardResolver,
    PatientService,
    PatientProgramService,
    PatientPreviousEncounterService,
    ProgramService,
    DepartmentProgramsConfigService,
    DatePipe,
    PatientRoutesFactory,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true
    }
  ],
})
export class PatientDashboardModule {
  public static routes = routes;
}
