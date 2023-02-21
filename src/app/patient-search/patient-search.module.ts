import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';

import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';

import { PatientSearchComponent } from './patient-search.component';
import { PatientSearchContainerComponent } from './patient-search-container.component';
import { PatientSearchService } from './patient-search.service';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { PatientRegistrationModule } from '../patient-creation/patient-creation.module';
import { HomeDashboardComponent } from '../home-dashboard/home-dashboard.component';
import { AppointmentsSchedulingComponent } from '../appointments-scheduling/appointments-scheduling.component';
import { CalendarModule } from 'angular-calendar';
import {
    AccordionModule, DataTableModule, SharedModule, TabViewModule,
    GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
    DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
    DropdownModule, ButtonModule
  } from 'primeng/primeng';
@NgModule({
    imports: [
        OpenmrsApi,
        FormsModule,
        CommonModule,
        NgxPaginationModule,
        PatientRegistrationModule,
        RouterModule,
        TabViewModule,
        CalendarModule.forRoot()
    ],
    exports: [ PatientSearchComponent, AppointmentsSchedulingComponent],
    declarations: [PatientSearchComponent, PatientSearchContainerComponent, AppointmentsSchedulingComponent,  HomeDashboardComponent,],
    providers: [PatientSearchService, AppFeatureAnalytics],
})
export class PatientSearchModule { }
