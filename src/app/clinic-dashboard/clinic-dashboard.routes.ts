import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { ClinicDashboardGuard } from './clinic-dashboard.guard';
export const routes = [
  {
    path: '',
    children: [
      { path: '', component: ClinicDashboardComponent },
      {
        path: ':location_uuid', component: ClinicDashboardComponent,
        canActivate: [
          ClinicDashboardGuard
        ],
         canDeactivate: [
          ClinicDashboardGuard
        ],
        children: [
          {
            path: 'general', loadChildren: './general/general.module#GeneralModule'
          },
          {
            path: 'treatment',
            loadChildren: './oncology/oncology-program.module#OncologyProgramModule'
          },
          {
            path: 'screening',
            loadChildren: './oncology/oncology-program.module#OncologyProgramModule'
          },
          { path: '', redirectTo: 'general', pathMatch: 'prefix' }
        ]
      }
    ]
  },
];
