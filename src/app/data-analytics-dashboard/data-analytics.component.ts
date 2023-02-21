import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../utils/local-storage.service';

@Component({
  selector: 'data-analytics-dashboard',
  templateUrl: './data-analytics.component.html',
  styleUrls: ['./data-analytics.component.css']
})
export class DataAnalyticsDashboardComponent implements OnInit {

  public selectedMedicalService: any;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  public ngOnInit() {
    this.selectedMedicalService = this.getUserMedicalService();
    const medicalService = this.selectedMedicalService.length > 0 ? this.selectedMedicalService[0].itemName.toLowerCase() : 'general';
    switch (medicalService) {
      case 'treatment':
        this.router.navigate(['/data-analytics', medicalService, 'treatment-reports']);
        break;

      case 'screening':
        this.router.navigate(['/data-analytics', medicalService, 'screening-reports']);
        break;
      case 'research':
        this.router.navigate(['/data-analytics', medicalService, 'screening-reports']);
        break;
    }

  }

  public getUserMedicalService() {
    let medicalService = this.localStorageService.getItem('userDefaultServiceOffered');
    if (medicalService === '[""]') {
      medicalService = undefined;
    }
    if (!medicalService) {
      this.router.navigate(['/user-default-properties']);
    }
    return JSON.parse(medicalService);
  }
}
