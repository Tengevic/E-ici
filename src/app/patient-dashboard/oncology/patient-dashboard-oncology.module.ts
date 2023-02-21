import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { NgicimrsSharedModule } from "../../shared/ngicimrs-shared.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { PocHttpInteceptor } from "src/app/shared/services/poc-http-interceptor";

import { PanelModule } from "primeng/primeng";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxBarcodeModule } from "ngx-barcode";
import { NgxPaginationModule } from "ngx-pagination";
import { OncologyLandingPageComponent } from "./landing-page/landing-page.component";
import { OncologySummaryComponent } from "./oncology-summary/oncology-summary.component";
import { OncologySummaryLatestComponent } from "./oncology-summary/oncology-summary-latest.component";
import { OncologyDiagnosisHistoryComponent } from "./diagnosis-history/oncology-diagnosis-history.component";
import { OncologyMedicationHistoryComponent } from "./medication-history/oncology-medication-history.component";
import { OncologyProgramSnapshotComponent } from "./program-snapshot/oncology-program-snapshot.component";
import { ScreeningHistoryComponent } from "./screening-history/screening-history.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgicimrsSharedModule,
    HttpClientModule,
    PanelModule,
    NgxBarcodeModule,
    TabsModule.forRoot(),
    NgxPaginationModule,
  ],
  exports: [
    OncologyLandingPageComponent,
    OncologyDiagnosisHistoryComponent,
    OncologySummaryComponent,
    OncologyMedicationHistoryComponent,
    ScreeningHistoryComponent,
    OncologyProgramSnapshotComponent,
  ],
  declarations: [
    OncologyLandingPageComponent,
    OncologySummaryComponent,
    OncologySummaryLatestComponent,
    OncologyDiagnosisHistoryComponent,
    OncologyMedicationHistoryComponent,
    OncologyProgramSnapshotComponent,
    ScreeningHistoryComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true,
    },
  ],
})
export class PatientDashboardOncologyModule {}
