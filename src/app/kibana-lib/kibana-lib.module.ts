// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgicimrsSharedModule } from '../shared/ngicimrs-shared.module';

// This Module's Components
import { DashboardsViewerComponent } from './dashboards-viewer/dashboards-viewer.component';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';

@NgModule({
    imports: [
        CommonModule,
        NgicimrsSharedModule
    ],
    declarations: [
        DashboardsViewerComponent,
        DashboardListComponent
    ],
    exports: [
        DashboardsViewerComponent,
        DashboardListComponent
    ]
})
export class KibanaLibModule {

}
