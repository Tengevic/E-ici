import { Injectable } from '@angular/core';


// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';
import { AppSettingsService } from '../app-settings/app-settings.service';

import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentResourceService {

  v = 'full';

  constructor(protected http: HttpClient,
    protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'appointment';
  }
 public addNewAppointment () {

 }
 public getAppointments () {

 }
 public getAppointmentsByDay (date: string, cached: boolean = false, v: string = null) {
  let url = this.getUrl();
  url += '/all';
  const params: HttpParams = new HttpParams();
  return this.http.get(url, {
    params: params
  }).pipe(
    map((response) => {
      return response;
    }));

 }
 getAppointmentSummary (date: string, cached: boolean = false, v: string = null) {
  let url = this.getUrl();
  url += '/appointmentSummary';
  const params: HttpParams = new HttpParams();
  return this.http.get(url, {
    params: params
  }).pipe(
    map((response) => {
      return response;
    }));

 }

}
