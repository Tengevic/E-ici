
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DateTimePickerModule
} from 'ngx-openmrs-formentry/';
import { EtlApi } from '../../etl-api/etl-api.module';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { analyticsPatientReferralProgramRouting } from './referral-program.routes';
import { PatientProgramService } from '../../patient-dashboard/programs/patient-programs.service';
import { ProgramService } from '../../patient-dashboard/programs/program.service';
import { NgicimrsSharedModule } from '../../shared/ngicimrs-shared.module';
import { ProgramManagerModule } from '../../program-manager/program-manager.module';

@NgModule({
  imports: [
    analyticsPatientReferralProgramRouting,
    DateTimePickerModule,
    EtlApi,
    DataListsModule,
    CommonModule,
    FormsModule,
    ProgramManagerModule,
    NgicimrsSharedModule
  ],
  exports: [],
  declarations: [],
  providers: [PatientProgramService, ProgramService],
})
export class AnalyticsPatientReferralProgramModule { }
