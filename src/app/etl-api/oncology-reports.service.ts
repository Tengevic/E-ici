import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class OncologyReportService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService) {}

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getOncologyReports(eiciService): Observable<any> {
    console.log(eiciService);
    const url = this.getBaseUrl() + eiciService.report;
    const request = this.http.get(url);

    return this.cacheService.cacheRequest(url, '' , request);
  }

  public getSpecificOncologyReport(reportUuid): Observable<any> {
    const url = this.getBaseUrl() + 'treatment-report';
    let urlParams: HttpParams = new HttpParams();

    if (reportUuid && reportUuid !== '') {
      urlParams = urlParams.set('reportUuid', reportUuid);
    } else {
      return of({
        'error': 'Null ReportUuid'
      });
    }

    const request = this.http.get(url, { params: urlParams });
    return this.cacheService.cacheRequest(url, '' , request);
  }
}
