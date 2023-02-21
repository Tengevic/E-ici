import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'src/app/utils/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SelectServiceOfferedService {

  public selectedServiceOfferedSource = new BehaviorSubject<string>('');

  public selectedService$ = this.selectedServiceOfferedSource.asObservable();
  constructor(private localStorageService: LocalStorageService) {
  }

  public setServiceOffered(service: string) {
    this.selectedServiceOfferedSource.next(service);
  }

  public getServiceOffered() {
    return this.selectedServiceOfferedSource.asObservable();
  }

  public getUserSetServiceOffered(): string {
    const userDefaultServiceOffered: any = JSON.parse(this.localStorageService.getItem('userDefaultServiceOffered'));
    // defaults to screening service
    let serviceOffered = 'SCREENING';
    if (typeof userDefaultServiceOffered !== 'undefined') {
      serviceOffered = userDefaultServiceOffered[0].itemName;
    }
    return serviceOffered;

  }
}
