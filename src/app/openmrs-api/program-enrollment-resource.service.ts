
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';
import { AppSettingsService } from '../app-settings/app-settings.service';

// TODO inject service

@Injectable()
export class ProgramEnrollmentResourceService {

  private $unenrolledFromProgramEvent: Subject<any> = new Subject();

  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'programenrollment';
  }

  public getProgramEnrollmentByPatientUuid(uuid: string): Observable<any> {

    const url = this.getUrl();
    const v: string = 'custom:(uuid,display,voided,dateEnrolled,dateCompleted,' +
      'location,program:(uuid),states:(uuid,startDate,endDate,state:(uuid,initial,terminal,' +
      'concept:(uuid,display))))';

    if (!uuid) {
      return null;
    }

    const params: HttpParams = new HttpParams()
      .set('v', v)
      .set('patient', uuid);

    return this.http.get(url, {
      params: params
    }).pipe(map((response: any) => {
      return this.processPrograms(response.results);
    }));
  }

  public getProgramEnrollmentStates(uuid: string): Observable<any> {

    let url = this.getUrl();
    const v = 'custom:(uuid,display,states:(uuid,startDate,endDate,' +
      'state:(uuid,concept:(uuid,display))))';

    if (!uuid) {
      return null;
    }

    const params: HttpParams = new HttpParams()
      .set('v', v);
    url = url + '/' + uuid;

    return this.http.get(url, {
      params: params
    }).pipe(map((response: any) => {
      return response.results;
    }));
  }

  public saveUpdateProgramEnrollment(payload, change?) {
    if (!payload) {
      return null;
    }
    let url = this.getUrl();
    if (payload.uuid) {
      url = url + '/' + payload.uuid;
    }
    delete payload['uuid'];
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const locationChange = 'location';
    if (payload['dateCompleted'] && (change !== locationChange) || !change) {
      // console.log(payload);
      return this.http.post(url, JSON.stringify(payload), { headers }).pipe(
        flatMap((program) => {
          this.broadcastUnenrolledProgram(program);
          return Observable.of(program);
        }),
        catchError(this.handleError));

    } else {

      return this.http.post(url, JSON.stringify(payload), { headers }).pipe(
        catchError(this.handleError));
    }
  }

  public updateProgramEnrollmentState(programEnrollmentUuid, payload) {
    if (!payload || !programEnrollmentUuid) {
      return null;
    }

    if (!payload.uuid) {
      return null;
    }
    let url = this.getUrl();
    url = url + '/' + programEnrollmentUuid + '/' + 'state' + '/' + payload.uuid;

    delete payload['uuid'];
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(payload), { headers }).pipe(
      catchError(this.handleError));
  }

  private handleError(error: any) {
    return observableThrowError(error.message
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : 'Server Error');
  }

  private processPrograms(data) {
    const arr = [];
    if (data.length > 0) {
      data.forEach((d) => {
        if (d.program.uuid === 'c4246ff0-b081-460c-bcc5-b0678012659e') {
          d.display = 'VIREMIA PROGRAM';
          arr.push(d);
        } else {
          arr.push(d);
        }
      });
    }

    return arr;
  }

  public getProgramUnenrollmentEvent() {
    return this.$unenrolledFromProgramEvent.asObservable();
  }

  public broadcastUnenrolledProgram(unenrolledProgram) {
    this.$unenrolledFromProgramEvent.next(unenrolledProgram);
  }

}
