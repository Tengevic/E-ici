import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupEnrollmentSummaryComponent } from './group-enrollment-summary.component';
import { NgicimrsSharedModule } from '../../shared/ngicimrs-shared.module';
import { GroupManagerModule } from '../../group-manager/group-manager.module';
import { GroupEnrollmentComponent } from './group-enrollment/group-enrollment.component';

@NgModule({
    declarations: [
        GroupEnrollmentSummaryComponent,
        GroupEnrollmentComponent
    ],
    imports: [
        CommonModule,
        NgicimrsSharedModule,
        GroupManagerModule
     ],
    providers: [],
    entryComponents: [],
    exports: [
        GroupEnrollmentComponent
    ]
})
export class GroupEnrollmentModule {}
