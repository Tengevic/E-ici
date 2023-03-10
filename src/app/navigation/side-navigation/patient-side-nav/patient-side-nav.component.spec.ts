/*
 * Testing a simple Angular 2┬ácomponent
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouteModel } from '../../../shared/dynamic-route/route.model';
import { DynamicRoutesService } from '../../../shared/dynamic-route/dynamic-routes.service';
import {  } from 'jasmine';
import { PatientSideNavComponent } from './patient-side-nav.component';
import { NavigationService } from '../../navigation.service';
import { UserService } from '../../../openmrs-api/user.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PatientSideNavComponent:', () => {
    let fixture: ComponentFixture<PatientSideNavComponent>;
    let comp: PatientSideNavComponent;
    let formRouteLabelEl;
    let navigationServiceStub: Partial<NavigationService>;
    navigationServiceStub = {
        checkFormsTabViewingRight: () => true,
        expandSideBar: () => false,
        collapseSideBar: () => true,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [
                PatientSideNavComponent
            ],
            providers: [
                        DynamicRoutesService,
                        {
                            provide: NavigationService,
                            useValue: navigationServiceStub
                        },
                        UserService,
                       AppSettingsService
                    ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(PatientSideNavComponent);
            comp = fixture.componentInstance;
        });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be injected', () => {
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should changed the displayed new routes for a patient when they change',
        (done) => {
            const dynamicRoutesService: DynamicRoutesService = TestBed.get(DynamicRoutesService);
            const newRoutes: Array<RouteModel> = [new RouteModel(), new RouteModel()];
            dynamicRoutesService.setPatientDashBoardRoutes(newRoutes);
            fixture.detectChanges();
            expect(fixture.componentInstance.routes).toBe(newRoutes);
            expect(fixture.componentInstance.selectedRoute).toBe(newRoutes[0]);
            done();
        });

    it('should display the child routes for the selected programs when' +
        ' a program route is selected', (done) => {
            const dynamicRoutesService: DynamicRoutesService = TestBed.get(DynamicRoutesService);
            const programRoute = new RouteModel();
            programRoute.renderingInfo = {};
            programRoute.initials = 'P';
            programRoute.label = 'program';
            programRoute.url = 'url';

            const newRoutes: Array<RouteModel> = [programRoute, new RouteModel()];
            dynamicRoutesService.setPatientDashBoardRoutes(newRoutes);
            fixture.detectChanges();
            fixture.componentInstance.viewChildRoutes(programRoute);
            fixture.detectChanges();

            expect(fixture.componentInstance.viewingChildRoutes).toBe(true);
            expect(fixture.componentInstance.selectedRoute).toBe(programRoute);
            done();
        });

        it('should display Forms Tab depending on the roles', (done) => {
            const dynamicRoutesService: DynamicRoutesService = TestBed.get(DynamicRoutesService);
            const programRoute = new RouteModel();
            programRoute.renderingInfo = {};
            programRoute.initials = 'G';
            programRoute.label = 'General Info';
            programRoute.url = 'url';

            const newRoutes: Array<RouteModel> = [programRoute, new RouteModel()];
            dynamicRoutesService.setPatientDashBoardRoutes(newRoutes);
            fixture.detectChanges();
            comp.viewChildRoutes(programRoute);
            fixture.detectChanges();

            formRouteLabelEl = fixture.debugElement.query(By.css('.child-route-label'));
            expect(comp.viewingChildRoutes).toBe(true);
            expect(comp.selectedRoute).toBe(programRoute);
            expect(comp.canViewFormsTab).toBe(true, 'Can View Forms Tab If Authorized');

            const navigationService = TestBed.get(NavigationService);
            navigationService.checkFormsTabViewingRight = () => false;
            comp.setFormsTabViewingRight();
            fixture.detectChanges();
            expect(comp.canViewFormsTab).toBe(false, 'Can\'t View Forms Tab If not Authorized');
            formRouteLabelEl = fixture.debugElement.query(By.css('.child-route-label'));
            expect(formRouteLabelEl).toBeNull();
            done();
        });
});
