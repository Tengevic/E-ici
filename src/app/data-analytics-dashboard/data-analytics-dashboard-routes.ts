import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataAnalyticsDashboardGuard } from './data-analytics-guard';
import { DataAnalyticsHivModule } from './hiv/data-analytics-hiv.module';
import { DataAnalyticsDashboardComponent } from './data-analytics.component';
export const routes: Routes = [
  {
    path: '',
    component: DataAnalyticsDashboardComponent,
    canActivate: [
      DataAnalyticsDashboardGuard
    ],
    children: [
      {
        path: 'treatment',
        loadChildren: './oncology/data-analytics-oncology.module#DataAnalyticsOncologyModule'
      },
      {
        path: 'screening',
        loadChildren: './oncology/data-analytics-oncology.module#DataAnalyticsOncologyModule'
      },
      {
        path: 'research',
        loadChildren: './oncology/data-analytics-oncology.module#DataAnalyticsOncologyModule'
      },
      {
        path: 'referral',
        loadChildren: './referral/referral-program.module#AnalyticsPatientReferralProgramModule'
      }
    ]
  }
];

export const dataAnalyticsDashboardRouting: ModuleWithProviders =
  RouterModule.forChild(routes);
