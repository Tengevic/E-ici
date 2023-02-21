import { Injectable } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DataCacheService } from "../shared/services/data-cache.service";
import { HttpClient, HttpParams } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class ServicesOfferedProgramsConfigService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getserviceOfferedProgramsConfig(): Observable<any> {
    const url = this.getBaseUrl() + "medicalservicesoffered-programs-config";
    const request = this.http.get(url);

    return this.cacheService.cacheRequest(url, "", request);
  }
  public checkandEnrolliThembaRandomization(requeste): Observable<any> {
    const url = this.getBaseUrl() + "IThemba/checkenrollment";
    const urlParams: HttpParams = new HttpParams()
      .set("location", requeste.location)
      .set("person", requeste.person.uuid)
      .set("encounter", requeste.encounter);
    const request = this.http
      .get<any>(url, {
        params: urlParams,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }

  public getServicePrograms(service): Observable<any> {
    const url = this.getBaseUrl() + "medical-service-programs";
    const urlParams: HttpParams = new HttpParams().set("service", service);
    urlParams.set("service", service);

    const request = this.http
      .get<any>(url, {
        params: urlParams,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
