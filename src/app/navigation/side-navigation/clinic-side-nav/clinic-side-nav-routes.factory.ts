import { Injectable } from "@angular/core";

import { RoutesProviderService } from "../../../shared/dynamic-route/route-config-provider.service";
import { RouteModel } from "../../../shared/dynamic-route/route.model";
import { Patient } from "../../../models/patient.model";
import { LocalStorageService } from "../../../utils/local-storage.service";
@Injectable()
export class ClinicRoutesFactory {
  public selectedMedicalService: any;

  constructor(
    public routesProvider: RoutesProviderService,
    private _localStorageService: LocalStorageService
  ) {}

  public createClinicDashboardRoutes(locationUuid): RouteModel[] {
    if (locationUuid === null || locationUuid === undefined) {
      throw new Error("Location is required");
    }
    let selectedMedicalService: any;
    const setMedicalService: any = JSON.parse(
      this._localStorageService.getItem("userDefaultServiceOffered")
    );
    selectedMedicalService = setMedicalService[0].itemName;
    this.selectedMedicalService = selectedMedicalService;
    let clinicRoutesConfig: any = this.routesProvider.clinicDashboardConfig;
    clinicRoutesConfig = this.processSharedRoutes(clinicRoutesConfig);

    const routes: RouteModel[] = [];
    if (Array.isArray(clinicRoutesConfig["medicalServices"])) {
      for (const medicalService of clinicRoutesConfig.medicalServices) {
        const medicalServiceName = medicalService.medicalServiceName;
        if (medicalServiceName === this.selectedMedicalService) {
          routes.push(
            this.createClinicRouteModel(medicalService, locationUuid)
          );
        }
      }
    }

    return routes;
  }

  public createAnalyticsDashboardRoutes(): RouteModel[] {
    let selectedMedicalService: any;
    const setMedicalService: any = JSON.parse(
      this._localStorageService.getItem("userDefaultServiceOffered")
    );
    selectedMedicalService = setMedicalService[0].itemName;
    this.selectedMedicalService = selectedMedicalService;

    let analyticsRoutesConfig: any = this.routesProvider
      .analyticsDashboardConfig;
    analyticsRoutesConfig = this.processSharedRoutes(analyticsRoutesConfig);

    const routes: RouteModel[] = [];
    if (Array.isArray(analyticsRoutesConfig["medicalServices"])) {
      for (const medicalService of analyticsRoutesConfig.medicalServices) {
        const medicalServiceName = medicalService.medicalServiceName;
        if (medicalServiceName === this.selectedMedicalService) {
          routes.push(this.createAnalyticsRouteModel(medicalService));
        }
      }
    }

    return routes;
  }

  public processSharedRoutes(routesConfig) {
    console.log(routesConfig);
    if (routesConfig.sharedRoutes) {
      for (const prog of routesConfig.programs) {
        if (prog["shared-routes-class"]) {
          prog.routes = routesConfig.sharedRoutes[prog["shared-routes-class"]];
        }
      }
    }
    return routesConfig;
  }

  private createClinicRouteModel(
    routInfo: any,
    locationUuid: string
  ): RouteModel {
    const model = new RouteModel();
    model.label = routInfo.medicalServiceName;
    model.initials = (routInfo.medicalServiceName as string).charAt(0);
    model.url = "clinic-dashboard/" + locationUuid + "/" + routInfo.alias;
    model.renderingInfo = {
      icon: "fa fa-square-o",
    };
    this.createClinicChildRoutes(routInfo.routes, model);
    return model;
  }

  private createAnalyticsRouteModel(routInfo: any): RouteModel {
    const model = new RouteModel();
    model.label = routInfo.medicalServiceName;
    model.initials = (routInfo.medicalServiceName as string).charAt(0);
    model.url = "data-analytics/" + routInfo.alias;
    model.renderingInfo = {
      icon: "fa fa-square-o",
    };
    this.createClinicChildRoutes(routInfo.routes, model);
    return model;
  }

  private createClinicChildRoutes(
    routInfo: any[],
    clinicRouteModel: RouteModel
  ) {
    clinicRouteModel.childRoutes = [];
    routInfo.forEach((route) => {
      clinicRouteModel.childRoutes.push(
        this.createClinicChildRoute(route, clinicRouteModel)
      );
    });
  }

  private createClinicChildRoute(
    routInfo: any,
    clinicRouteModel: RouteModel
  ): RouteModel {
    const model = new RouteModel();
    model.url = clinicRouteModel.url + "/" + routInfo.url;
    model.label = routInfo.label;
    model.initials = routInfo.initials || (routInfo.label as string).charAt(0);
    model.renderingInfo = {
      icon: routInfo.icon,
    };
    model.isDistinct = routInfo.isDistinct;
    return model;
  }
}
