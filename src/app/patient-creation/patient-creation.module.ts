import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import { PatientCreationComponent } from './patient-creation.component';
import { PatientCreationService } from './patient-creation.service';
import {
    PatientCreationResourceService
} from '../openmrs-api/patient-creation-resource.service';
import { SessionStorageService } from '../utils/session-storage.service';
import {
    PatientIdentifierTypeResService
} from '../openmrs-api/patient-identifierTypes-resource.service';
import {
    LocationResourceService
} from '../openmrs-api/location-resource.service';
import { UserService } from '../openmrs-api/user.service';
import { BulkPatientDataCreationComponent } from './bulk-patient-data-creation/bulk-patient-data-creation.component';
import { NgxFileUploaderModule } from 'ngx-file-uploader';
import { BulkPatientComponent } from './bulk-patient/bulk-patient.component';
import { TabViewModule } from 'primeng/primeng';
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        DateTimePickerModule,
        NgSelectModule,
        TabViewModule,
        NgxPaginationModule,
        ModalModule,
        NgxFileUploaderModule
    ],
    declarations: [
        PatientCreationComponent,
        BulkPatientDataCreationComponent,
        BulkPatientComponent
    ],
    exports: [
        PatientCreationComponent
    ],
    providers: [
        PatientCreationService,
        PatientCreationResourceService,
        BsModalService,
        SessionStorageService,
        PatientIdentifierTypeResService,
        LocationResourceService,
        UserService
    ]
})
export class PatientRegistrationModule {
}
