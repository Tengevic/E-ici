
import { take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeedBackService } from './feedback.service';
import { UserService } from '../openmrs-api/user.service';
import { UserDefaultPropertiesService } from '../user-default-properties/user-default-properties.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import {
    DepartmentProgramsConfigService
} from '../etl-api/department-programs-config.service';
import { ServicesOfferedProgramsConfigService } from '../etl-api/services-offered-programs-config.service';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'feedback',
    templateUrl: 'feedback.component.html',
    styleUrls: ['feedback.component.css'],
    providers: [FeedBackService, UserService, UserDefaultPropertiesService]
})
export class FeedBackComponent implements OnInit, OnDestroy {
    public success = false;
    public error = false;
    // public programDepartments: any = [];
    public programMedicalServices: any = [];
    public medicalService: string;
    public selectedDepartment: string;
    public selectedMedicalService: string;
    public medicalServiceIsSelected = false;
    public payload = {
        name: '',
        phone: '',
        message: '',
        location: '',
        medicalService: ''
    };
    public busy: Subscription;
    public errorMessage = '';
    public hasError = false;
    public r1 = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))/;
    public r2 = /(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
    public patterns = new RegExp(this.r1.source + this.r2.source);
    // public departmentConf: any[];
    public medicalServiceConf: any[];
    constructor(private feedBackService: FeedBackService,
        private userService: UserService,
        private userDefaultPropertiesService: UserDefaultPropertiesService,
        public _servicesOfferedService: ServicesOfferedProgramsConfigService,
        ) { }

    public ngOnInit() {
        // this.getDepartmentConf();
        this.getMedicalServiceOfferedConf();
    }

    public ngOnDestroy() {
        if (this.busy) {
            this.busy.unsubscribe();
        }
    }

    public sendFeedBack() {
        this.validatePhoneNumberField(this.payload.phone);
        this.payload.name = this.userService.getLoggedInUser().display;
        const location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject()
            || {};
        this.payload.location = location.display || 'Default location not set';
        this.payload.medicalService = this.selectedMedicalService || 'Medical Sevice not selected';
        this.busy = this.feedBackService.postFeedback(this.payload).pipe(take(1)).subscribe((res) => {
            this.success = true;
            this.payload = {
                name: '',
                phone: '',
                message: '',
                location: '',
                medicalService: ''
            };
        }, (error) => {
            console.log('Error');
            this.error = true;
        });
    }

    public goBack() {
        window.history.back();
    }

    public dismissSuccess() {
        this.success = false;
    }

    public dismissError() {
        this.error = false;
    }
        public getMedicalServiceOfferedConf() {
        this._servicesOfferedService.getserviceOfferedProgramsConfig().pipe(
            take(1)).subscribe((results) => {
                 if (results) {
                    this.medicalServiceConf = results;
                    this._filterMedicalServiceConfigByName();
                }
            });

    }
    public getSelectedMedicalService(medService) {
        this.selectedMedicalService = medService;
        if (medService) {
            this.medicalServiceIsSelected = true;
        }
    }

    private setErroMessage(message) {

        this.hasError = true;
        this.errorMessage = message;
    }

    private validatePhoneNumberField(phone) {

        if (this.isNullOrUndefined(phone)) {
            this.setErroMessage('Phone number is required.');
            return false;
        }

        return true;
    }

    private isNullOrUndefined(val) {
        return val === null || val === undefined || val === ''
            || val === 'null' || val === 'undefined';
    }
    private _filterMedicalServiceConfigByName() {
        this.programMedicalServices = _.map(this.medicalServiceConf, (config: any) => {
            return { name: config.name };
        });
    }
}
