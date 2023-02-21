import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { OncologyReportsComponent } from "./oncology-reports/oncology-reports.component";
import { OncologySummaryIndicatorsComponent } from "./oncology-reports/oncology-summary-indicators/oncology-summary-indicators.component";
import { OncologySummaryIndicatorsPatientListComponent } from "./oncology-reports/oncology-indicators-patient-list/oncology-indicators-patient-list.component";
import { AdminDashboardClinicFlowComponent } from "../hiv/clinic-flow/admin-dashboard-clinic-flow";
import { DataEntryStatisticsComponent } from "../../data-entry-statistics/data-entry-statistics.component";
import { DataEntryStatisticsPatientListComponent } from "../../data-entry-statistics/data-entry-statistics-patient-list.component";
import { PatientsProgramEnrollmentComponent } from "../../patients-program-enrollment/patients-program-enrollment.component";
import { ProgramEnrollmentPatientListComponent } from "../../patients-program-enrollment/program-enrollent-patient-list.component";
import { ChangeDepartmentComponent } from "../change-department/change-department.component";
import { CompassionateReportComponent } from "./oncology-reports/compassionate-report/compassionate-report.component";

const routes: Routes = [
  {
    path: "treatment-reports",
    children: [
      {
        path: "",
        component: OncologyReportsComponent,
        data: {
          report: "treatment-reports",
        },
      },
      {
        path: "breast-cancer-treatment-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: "cervical-cancer-treatment-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: "social-history-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: "patient-vitals-treatment-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: "palliative-care-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: "death-report-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: "general-cancer-treatment-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: "lung-cancer-treatment-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: ":treatment-program/patient-list",
        component: OncologySummaryIndicatorsPatientListComponent,
      },
    ],
  },
  {
    path: "screening-reports",
    children: [
      {
        path: "",
        component: OncologyReportsComponent,
        data: {
          report: "screening-reports",
        },
      },
      {
        path: "breast-cancer-screening-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: "prostate-cancer-screening-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: "cervical-cancer-screening-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: ":screening-program/patient-list",
        component: OncologySummaryIndicatorsPatientListComponent,
      },
      {
        path: "combined-breast-cervical-cancer-screening-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
      {
        path: "lung-cancer-screening-numbers",
        component: OncologySummaryIndicatorsComponent,
      },
    ],
  },
  {
    path: "research-reports",
    children: [
      {
        path: "",
        component: OncologyReportsComponent,
      },
    ],
  },
  {
    path: "clinic-flow",
    component: AdminDashboardClinicFlowComponent,
  },
  {
    path: "program-enrollment",
    children: [
      {
        path: "",
        component: PatientsProgramEnrollmentComponent,
      },
      {
        path: "patient-list",
        component: ProgramEnrollmentPatientListComponent,
      },
    ],
  },
  {
    path: "compassionate-report",
    children: [
      {
        path: "",
        component: CompassionateReportComponent,
      },
      {
        path: "patient-list",
        component: ProgramEnrollmentPatientListComponent,
      },
    ],
  },

  {
    path: "data-entry-statistics",
    children: [
      {
        path: "",
        component: DataEntryStatisticsComponent,
      },
      {
        path: "patient-list",
        component: DataEntryStatisticsPatientListComponent,
      },
    ],
  },
  {
    path: "select-medicalService",
    component: ChangeDepartmentComponent,
  },
];

export const DataAnalyticsDashboardOncologyRouting: ModuleWithProviders = RouterModule.forChild(
  routes
);
