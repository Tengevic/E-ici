
import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';
import { GridOptions } from 'ag-grid/main';
import 'ag-grid-enterprise/main';
import * as Moment from 'moment';
import { Subscription } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import {
  RadiologyImagingResourceService
} from '../../../etl-api/radiology-imaging-resource.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {
  AppFeatureAnalytics
} from '../../../shared/app-analytics/app-feature-analytics.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';

@Component({
  selector: 'patient-imaging',
  templateUrl: 'patient-imaging.component.html',
  styleUrls: []
})
export class PatientImagingComponent implements OnInit, OnDestroy {
  public patient: any;
  public error: string;
  public loadingPatient: boolean;
  public fetchingResults: boolean;
  public isLoading: boolean;
  public patientIdentifier: any;
  public nextStartIndex = 0;
  public dataLoaded = false;
  public imagingResults = [];
  public subscription: Subscription;
  public gridOptions: GridOptions;
  public message: string;
  public display = false;
  public thumbs: any;
  public encounterId: any;
  public errors: any = [];
  public showSuccessAlert = false;
  public showErrorAlert = false;
  public errorAlert: string;
  public errorTitle: string;
  public successAlert = '';
  public result: any;
  public imageToShow: any;
  public filterTerm = '';
  public dateReported: string;
  public allImages: any = [];
  @ViewChild('staticModal')
  public staticModal: ModalDirective;
  @ViewChild('modal')
  public modal: ModalComponent;
  @ViewChild('staticModalCompare')
  public staticModalCompare: ModalDirective;
  public compareImages = [];
  private isChecked = [];
  constructor(
    private radiologyImagingResourceService: RadiologyImagingResourceService,
    private patientService: PatientService,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private domSanitizer: DomSanitizer,
    private zeroVlPipe: ZeroVlPipe) {
    this.gridOptions = {} as GridOptions;
  }

  public ngOnInit() {

    this.loadingPatient = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.loadingPatient = false;
        if (patient) {
          this.patient = patient;
          this.patientIdentifier = this.patient.commonIdentifiers.icimrsMrn ||
            this.patient.commonIdentifiers.iciMrsUId || this.patient.commonIdentifiers.cCC ||
            this.patient.commonIdentifiers.kenyaNationalId;
          this.getHistoricalPatientImagingResults(this.patientIdentifier);

        }
      }
    );
    this.compareImages = [];

  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getHistoricalPatientImagingResults(patientIdentifier) {
    this.fetchingResults = true;

    this.radiologyImagingResourceService.getPatientImagingReport(patientIdentifier).pipe(
      take(1)).subscribe((result) => {
        if (result.resourceType === 'OperationOutcome') {
          this.fetchingResults = false;
        }

        if (result.entry) {
          this.result = result.entry;
          this.imagingResults = this.formatReportTest(this.result);
          this.fetchAllImageFromRefpacs();
          this.imagingResults.sort((a, b) => {
            const key1 = a.effectiveDateTime;
            const key2 = b.effectiveDateTime;
            if (key1 > key2) {
              return -1;
            } else if (key1 === key2) {
              return 0;
            } else {
              return 1;
            }
          });
          this.splitReportContent(this.imagingResults);

          this.fetchingResults = false;
        }
      }, (err) => {
        this.fetchingResults = false;
        this.error = err;
      });

  }

  public fetchImageFromRefpacs(order) {
    this.dateReported = order.effectiveDateTime;
    this.fetchingResults = true;

    this.radiologyImagingResourceService.getWadoImageUrl(this.patientIdentifier, order.id).pipe(
      take(1)).subscribe((url) => {
        console.log('URL', url);

        this.staticModal.show();
        this.imageToShow = url;
        this.fetchingResults = false;
      }, (error) => {
        console.log('Error', error);
        this.fetchingResults = false;
        this.error = error;
      }

      );

  }
  public fetchAllImageFromRefpacs() {
    this.radiologyImagingResourceService.getAllPatientImageResult(this.patientIdentifier).pipe(
      take(1)).subscribe((res) => {
        this.allImages = res.entry;

        const v = this.gitImageIds(this.allImages);
        this.imagingResults = _.merge(v, this.imagingResults);
      }, (error) => {
        this.error = error;
      }

      );

  }

  public removeTags(strings, arr) {
    return arr ? strings.split('<').filter((val) => f(arr, val))
      .map((val) => f(arr, val)).join('') : strings.split('<')
        .map((d) => d.split('>').pop()).join('');
    function f(array, value) {
      return array.map((d) => value.includes(d + '>'))
        .indexOf(true) !== -1 ? '<' + value : value.split('>')[1];
    }
  }

  public likeImage(image) {
    this.message = ' ';
    this.thumbs = 1;
    this.encounterId = image.id;
    this.display = true;

  }

  public disLikeImage(image) {
    this.message = ' ';
    this.thumbs = 0;
    this.encounterId = image.id;
    this.display = true;

  }
  public dismissDialog() {
    this.message = ' ';
    this.display = false;
  }
  public splitReportContent(imagingResults) {
    const report = [];
    for (const i of imagingResults) {
      const val = _.split(i.report, ',', 3);
      i['report'] = Object.assign({}, val);
      report.push(i);

    }

    return report;

  }

  public createRadiologyComment() {

    const payload = {
      comments: this.message,
      encounterId: this.encounterId,
      thumbs: this.thumbs
    };

    this.radiologyImagingResourceService.createRadiologyComments(payload).pipe(take(1)).subscribe((success) => {
      if (success) {
        this.displaySuccessAlert('comment saved successfully');
        console.log('comments created successfully', success);
      }

    },
      (error) => {
        console.log('error', error);
        this.errors.push({
          id: 'patient',
          message: 'error adding comment'
        });
      });
    setTimeout(() => {
      this.display = false;
    }, 1000);

  }
  public valueChange(newValue) {
    this.filterTerm = newValue;
  }

  public close() {
    this.modal.close();
  }

  public dismissed() {
    this.modal.dismiss();
  }

  public formatReportTest(result) {

    const tests = [];
    for (const i of result) {
      const data = i.resource;
      for (const r in data) {
        if (data.hasOwnProperty(r)) {
          const lab = this.removeTags(data.text.div, ['/p']);
          data['report'] = lab.replace(/<[^>]+>/g, ',');
        }

      }
      tests.push(data);
    }

    return tests;

  }
  public compareImageFromRefpacs(order) {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Radiology Image Loaded', 'onClick');

    this.radiologyImagingResourceService.getWadoImageUrl(this.patientIdentifier, order.id).pipe(
      take(1)).subscribe((url) => {
        this.imageToShow = url;

        if (_.includes(this.isChecked, order.id)) {
          _.remove(this.compareImages, {
            id: order.id
          });
          delete this.isChecked[order.id];
        } else {
          this.compareImages.push({
            image: this.imageToShow, id: order.id,
            dateReported: order.effectiveDateTime, report: order.code.text
          });
          this.isChecked[order.id] = order.id;
        }

        if (this.compareImages.length > 1) {
          this.fetchingResults = true;
          setTimeout(() => {
            this.staticModalCompare.show();
          }, 500);

        }

        setTimeout(() => {
          this.fetchingResults = false;
        }, 1000);

        this.fetchingResults = false;

      }, (error) => {
        this.fetchingResults = false;
        this.error = error;
      }

      );

  }
  public SelectedValueChange(value) {

  }

  private displaySuccessAlert(message) {
    this.showErrorAlert = false;
    this.showSuccessAlert = true;
    this.successAlert = message;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 1000);
  }
  private gitImageIds(result) {
    const report = [];
    for (const i of result) {
      i['imageId'] = i.resource.id;
      report.push(i);

    }

    return report;

  }

}
