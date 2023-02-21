import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DataCacheService } from '../shared/services/data-cache.service';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import { ServicesOfferedProgramsConfigService } from '../etl-api/services-offered-programs-config.service';
import { ServiceProgramFilterComponent } from './service-program-filter.component';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        AngularMultiSelectModule,
        DateTimePickerModule
    ],
    exports: [ServiceProgramFilterComponent],
    declarations: [ServiceProgramFilterComponent],
    providers: [ServicesOfferedProgramsConfigService, DataCacheService],
})
export class EiciServiceProgramFilterModule { }
