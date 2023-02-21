import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";
import { AppSettingsService } from "src/app/app-settings/app-settings.service";

@Injectable()
export class BixolonService {
  public readonly DEFAULT_BIXOLON_URL = "http://localhost:18080/WebPrintSDK/";
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return this.DEFAULT_BIXOLON_URL;
  }

  public printLabel(payload): any {
    if (!payload) {
      return null;
    }
    const url = this.getUrl() + "Printer1";
    const headers = new HttpHeaders({ "Content-Type": "application/" });
    return this.http.post(url, payload, { headers });
  }
}
