import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartmentProgramFilterModule } from './../department-program-filter/department-program-filter.module';
import { AgGridModule } from 'ag-grid-angular/main';

import { PatientsProgramEnrollmentComponent } from './patients-program-enrollment.component';
import { PatientProgramEnrollmentService } from './../etl-api/patient-program-enrollment.service';
import { ProgramEnrollmentPatientListComponent } from './program-enrollent-patient-list.component';
import { ProgramEnrollmentSummaryComponent } from './program-enrollment-summary.component';
import { EiciServiceProgramFilterModule } from '../service-program-filter/eiciService-program-filter.module';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        DepartmentProgramFilterModule,
        EiciServiceProgramFilterModule,
        AgGridModule
    ],
    exports: [ PatientsProgramEnrollmentComponent],
    declarations: [
        PatientsProgramEnrollmentComponent,
        ProgramEnrollmentPatientListComponent,
        ProgramEnrollmentSummaryComponent
    ],
    providers: [PatientProgramEnrollmentService],
})
export class PatientProgramEnrollmentModule { }
