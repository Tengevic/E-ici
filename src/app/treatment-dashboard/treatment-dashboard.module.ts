import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { EtlApi } from '../etl-api/etl-api.module';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { TreatmentDashboardComponent } from './treatment-dashboard.component';
import { MatCardModule, MatDividerModule, MatExpansionModule, MatListModule,
   MatStepperModule, MatTabsModule, MatTreeModule, MatFormFieldModule, MatInputModule,
    MatButtonModule } from '@angular/material';
import { TreatmentDashboardGuard } from './treatment-dashboard.guard';
import { routes } from './treatment-dashboard.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EtlApi,
    ReactiveFormsModule,
    OpenmrsApi,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
    // RouterModule.forChild(routes),
    MatButtonModule
    ],
    exports: [
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TreatmentDashboardComponent
    ],
    providers: [
      TreatmentDashboardGuard,
    ],
  declarations: [
    TreatmentDashboardComponent
  ]
})
export class TreatmentDashboardModule {
  // public static routes = routes;
}
