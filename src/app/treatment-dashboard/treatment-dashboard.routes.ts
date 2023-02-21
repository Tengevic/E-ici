import { Routes } from '@angular/router';
import { PatientDashboardModule } from '../patient-dashboard/patient-dashboard.module';
import { LabOrderSearchContainerComponent } from '../lab-order-search';
import { TreatmentDashboardComponent } from './treatment-dashboard.component';
export function patientDashboardModule() {
  return PatientDashboardModule;
}
export const routes  = [
  {
    path: 'lab-order-search',
    component: LabOrderSearchContainerComponent
  },
  {
    path: 'patient-dashboard',
     loadChildren: '../patient-dashboard#PatientDashboardModule'
  },
];
