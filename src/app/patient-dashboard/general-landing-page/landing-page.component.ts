import {
  forkJoin as observableForkJoin,
  Subscription,
  Observable,
  Subject,
  BehaviorSubject,
} from "rxjs";

import { take, map, first } from "rxjs/operators";
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import * as _ from "lodash";
import * as moment from "moment";

import { Router } from "@angular/router";
import { Helpers } from "../../utils/helpers";

import { ProgramService } from "../programs/program.service";
import { PatientService } from "../services/patient.service";
import { Patient } from "../../models/patient.model";
import { PatientProgramResourceService } from "../../etl-api/patient-program-resource.service";
import { DepartmentProgramsConfigService } from "../../etl-api/department-programs-config.service";
import { PatientReferralService } from "../../program-manager/patient-referral.service";
import { UserDefaultPropertiesService } from "../../user-default-properties/user-default-properties.service";
import { PatientReferralResourceService } from "../../etl-api/patient-referral-resource.service";
import { Encounter } from "../../models/encounter.model";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";
import { ModalDirective } from "ngx-bootstrap/modal";
import { PatientVitalsService } from "../common/patient-vitals/patient-vitals.service";
import { SelectServiceOfferedService } from "src/app/shared/services/select-service-offered.service";
import { LocalStorageService } from "src/app/utils/local-storage.service";
import { PatientEncounterService } from "../common/patient-encounters/patient-encounters.service";
import { LabsResourceService } from "src/app/etl-api/labs-resource.service";
import { OncologySummaryResourceService } from "src/app/etl-api/oncology-summary-resource.service";

@Component({
  selector: "landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class GeneralLandingPageComponent implements OnInit, OnDestroy {
  @Input()
  public hideList = false;
  @ViewChild("staticModal")
  public staticModal: ModalDirective;
  @ViewChild("modal")
  public modal: ModalComponent;
  public patient: Patient = new Patient({});
  public hasError = false;
  public programsBusy = false;
  public errors: any[] = [];
  public addBackground: any = "white";
  public enrolledProgrames: any = [];
  public appointments: any = [];
  public allProgramVisitConfigs: any = {};
  public appointmentsummaryLoaded = false;
  public apphasData = false;
  public selectedEncounter: Encounter;
  public selectedVisitEncounter: Encounter;
  public showReferralEncounterDetail = false;
  public showVisitEncounterDetail = false;
  public loadingEncounter = false;
  public encounterViewed = false;
  public encounters: Encounter[];
  public lastEnrolledPrograms: any = [];
  private _datePipe: DatePipe;
  private subscriptions: Subscription[] = [];
  public loadingVitals = false;
  public vitals: Array<any> = [];
  public labResults = [];
  public myMedicalService: string;
  private treatmentUuid = "725b5193-3452-43fc-aca3-6a80432d9bfa";
  public noData = "No Patient Data Available";
  public encounterTypes: any = [];
  public labTests = {
    rbc: {
      test: "RBC",
      toolTip: "Red Blood Cell Count (10^6/µL)",
    },
    hemoglobin: {
      test: "HGB",
      toolTip: "Hemoglobin (g/gl)",
    },
    mcv: {
      test: "MCV",
      toolTip: "Mean corpuscular volume (FL)",
    },
    mch: {
      test: "MCH",
      toolTip: "Mean cell hemoglobin (pg)",
    },
    mchc: {
      test: "MCHC",
      toolTip: "Mean corpuscular hemoglobin concentration (g/gL)",
    },
    rdw: {
      test: "RDW",
      toolTip: "Red cell distribution width (%)",
    },
    plt: {
      test: "PLT",
      toolTip: "Platelets (10^3/ul)",
    },
    wbc: {
      test: "SERUM WBC",
      toolTip: "Serum white blood cells count (10^3/µL)",
    },
    anc: {
      test: "ANC",
      toolTip: "Absolute neutrophil count (mm3)",
    },
    creatinine: {
      test: "CREATININE",
      toolTip: "Creatinine (U/L)",
    },
    na: {
      test: "SODIUM",
      toolTip: "Sodium (mmol/Lm3)",
    },
    k: {
      test: "POTASSIUM",
      toolTip: "Potassium (mmol/L)",
    },
    cl: {
      test: "CHLORIDE",
      toolTip: "Chloride (mmol/L)",
    },
    total_bili: {
      test: "Total Bili",
      toolTip: "Total Bilirubin (µumol/L)",
    },
    direct_bili: {
      test: "Direct Bili",
      toolTip: "Direct Bilirubin (µumol/L)",
    },
    ast: {
      test: "AST",
      toolTip: "Aspartate Aminotransferase (SGOT) (g/L)",
    },
    alt: {
      test: "ALT",
      toolTip: "Alanine Aminotransferase (SGPT) (U/L)",
    },
    ldh: {
      test: "LDH",
      toolTip: "Lactate Dehydrogenase (U/L)",
    },
    alk_phos: {
      test: "ALP",
      toolTip: "Alkaline phosphatase (U/L)",
    },
    ggt: {
      test: "GGT",
      toolTip: "Gamma-Glutamyl Transferase (IU/L)",
    },
    total_protein: {
      test: "Total Protein",
      toolTip: "Total Protein (g/L)",
    },
    albumin: {
      test: "Albumin",
      toolTip: "Albumin (g/L)",
    },
    total_psa: {
      test: "Total PSA",
      toolTip: "Total PSA (ng/mL)",
    },
    cea: {
      test: "CEA",
      toolTip: "Carcinoembryonic antigen test (ng/mL)",
    },
    ca_19_9: {
      test: "(CA 19-9)",
      toolTip: "Carbohydrate Antigen 19-9 (U/mL)",
    },
    hbf: {
      test: "HBF",
      toolTip: "Hemoglobin F%",
    },
    hba: {
      test: "HBA",
      toolTip: "Hemoglobin A%",
    },
    hbs: {
      test: "HbS",
      toolTip: "Hemoglobin S%",
    },
    hba2: {
      test: "HBA2",
      toolTip: "Hemoglobin A2/C%",
    },
    pus_c_urine: {
      test: "PUS CELLS URINE",
      toolTip: "Presence of pus cells, urine",
    },
    protein_urine: {
      test: "PROTEIN URINE",
      toolTip: "Presence of protein, urine",
    },
    leuc: {
      test: "LEUCOCYTES",
      toolTip: "Presence of leucocytes",
    },
    ketone: {
      test: "KETONE",
      toolTip: "Presence of Ketone",
    },
    sugar_urine: {
      test: "SUGAR URINE",
      toolTip: "Presence of sugar, urine",
    },
    nitrites: {
      test: "NITRITES",
      toolTip: "Presence of Nitrites",
    },
    retic: {
      test: "RETICULOCYTES",
      toolTip: "Reticulocytes (%)",
    },
    a_1_glob: {
      test: "ALPHA-1 GLOBULIN",
      toolTip: "Serum, alpha-1 globulin",
    },
    a_2_glob: {
      test: "ALPHA-2 GLOBULIN",
      toolTip: "Serum, alpha-2 globulin",
    },
    beta_glob: {
      test: "BETA GLOBULIN",
      toolTip: "Serum, beta globulin",
    },
    gamma_glob: {
      test: "GAMMA GLOBULIN",
      toolTip: "Serum, gamma globulin",
    },
    kappa_l_c: {
      test: "KAPPA LIGHT CHAINS",
      toolTip: "Kappa light chains",
    },
    lambda_l_c: {
      test: "LAMBDA LIGHT CHAINS",
      toolTip: "Lambda light chains",
    },
    ratio_l_c: {
      test: "RATIO KAPPA LAMBDA",
      toolTip: "Ratio of kappa/lambda",
    },
  };

  constructor(
    private patientService: PatientService,
    private patientReferralService: PatientReferralService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private patientVitalsService: PatientVitalsService,
    private selectServiceOfferedService: SelectServiceOfferedService,
    private localStorage: LocalStorageService,
    private labsResourceService: LabsResourceService,
    private patientEncounterService: PatientEncounterService,
    private oncologySummary: OncologySummaryResourceService,
    private patientProgramResourceService: PatientProgramResourceService,
    private router: Router
  ) {
    this._datePipe = new DatePipe("en-US");
  }

  public ngOnInit() {
    this.getCurrentMedicalService();
    this.loadProgramBatch();
  }
  public loadPatientEncounters(patientUuid) {
    this.encounters = [];
    this.patientEncounterService
      .getEncountersByPatientUuid(this.patient.person.uuid)
      .subscribe(
        (data) => {
          this.encounters = data;
          this.loadEncounterTypes(data);
          this.getHistoricalPatientLabResults(this.patient.person.uuid, {
            startIndex: "0",
            limit: "10",
          });
          this.getAppointments();
          // a trick to wait for the encounter list to render
          setTimeout(() => {}, 2000);
        },
        (err) => {
          this.errors.push({
            id: "visit",
            message: "error fetching visit",
          });
        }
      );
  }
  public getAppointments() {
    this.oncologySummary
      .getOncologySummary(
        "appointment-history",
        this.patient.person.uuid,
        "programUuid"
      )
      .subscribe(
        (summary) => {
          this.appointmentsummaryLoaded = true;
          if (summary.length) {
            this.apphasData = true;
            this.appointments = summary;
          }
        },
        (error) => {
          this.errors.push({
            id: "summary",
            message: "Error fetching appointment history",
          });
        }
      );
  }
  public getHistoricalPatientLabResults(
    patientUuId,
    params: { startIndex: string; limit: string }
  ) {
    this.labsResourceService
      .getHistoricalPatientLabResults(patientUuId, {
        startIndex: "0",
        limit: "20",
      })
      .pipe(take(1))
      .subscribe(
        (result) => {
          if (result) {
            this.labResults = this.formatDateField(result);
            this.createColumnDefs();
            if (this.labResults.length > 0) {
              const size: number = this.labResults.length;
            } else {
            }
          }
        },
        (err) => {}
      );
    return this.labResults;
  }
  public createColumnDefs() {}
  public formatDateField(result) {
    const tests = [];
    for (const data of result) {
      for (const r in data) {
        if (data.hasOwnProperty(r)) {
          const lab = moment(data.test_datetime).format("DD-MM-YYYY");
          data["testDatetime"] = lab;
        }
      }
      tests.push(data);
    }
    return tests;
  }
  public loadEncounterTypes(encounters) {
    if (encounters.length > 0) {
      encounters.forEach((encounter) => {
        this.encounterTypes.push(encounter.encounterType.display);
      });

      this.sortEncounterTpes();
    }
  }
  public sortEncounterTpes() {
    const newUniqueEncounterTypes = _.uniq(this.encounterTypes);

    const sortByAlphOrder = _.sortBy(newUniqueEncounterTypes);

    this.encounterTypes = sortByAlphOrder;
  }
  public loadVitals(patientUuid, nextStartIndex): void {
    this.patientVitalsService.getVitals(this.patient, nextStartIndex).subscribe(
      (data) => {
        if (data) {
          if (data.length > 0) {
            const membersToCheck = [
              "weight",
              "height",
              "temp",
              "oxygen_sat",
              "f_systolic_bp",
              "f_diastolic_bp",
              "pulse",
            ];
            this.interpretEcogValuesForOncology(data);

            for (const r in data) {
              if (data.hasOwnProperty(r)) {
                const encounter = data[r];
                if (
                  !Helpers.hasAllMembersUndefinedOrNull(
                    encounter,
                    membersToCheck
                  )
                ) {
                  this.vitals.push(encounter);
                }
              }
            }
            const size: number = data.length;
            // this.isLoading = false;
            // this.loadingVitals = false;
          } else {
            // this.dataLoaded = true;
            // this.loadingVitals = false;
          }
        }
        // this.isLoading = false;
        this.loadPatientEncounters(patientUuid);
      },

      (err) => {
        this.loadingVitals = false;
        this.errors.push({
          id: "vitals",
          message: "error fetching patient",
        });
      }
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }
  public interpretEcogValuesForOncology(data: any) {
    _.each(data, (element) => {
      switch (element.ecog) {
        case 1115: {
          element.ecog = 0;
          break;
        }
        case 6585: {
          element.ecog = 1;
          break;
        }
        case 6586: {
          element.ecog = 2;
          break;
        }
        case 6587: {
          element.ecog = 3;
          break;
        }
        case 6588: {
          element.ecog = 4;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  public getCurrentMedicalService() {
    this.myMedicalService = this.selectServiceOfferedService.getUserSetServiceOffered();
    console.log(this.myMedicalService);
  }
  public showReferralEncounter(row: any) {
    const visitEncounter = _.find(this.patient.encounters, (encounter) => {
      return (
        encounter.location.uuid === row.referred_from_location_uuid &&
        encounter.uuid === row.encounter_uuid
      );
    });

    const enrollmentForms = this.filterRequiredEnrollmentForms(row);
    const referralEncounter = _.find(this.patient.encounters, (encounter) => {
      return (
        encounter.location.uuid === row.referred_from_location_uuid &&
        _.includes(enrollmentForms, encounter.encounterType.uuid)
      );
    });

    if (visitEncounter) {
      this.selectedVisitEncounter = new Encounter(visitEncounter);
      // hide by default
      this.showVisitEncounterDetail = false;
    }

    if (referralEncounter) {
      this.selectedEncounter = new Encounter(referralEncounter);
      // show by default
      this.showReferralEncounterDetail = true;
    }

    this.staticModal.show();
  }

  public patientHasBeenSeenInProgram(program) {
    if (!_.isUndefined(program.referred_to_location_uuid)) {
      const patientEncounters = this.patient.encounters;
      console.log(this.patient);
      const location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
      // patient was referred to this location
      if (location.uuid === program.referred_to_location_uuid) {
        const referralEncounter = _.find(patientEncounters, (encounter) => {
          return (
            encounter.location.uuid === program.referred_from_location_uuid &&
            program.encounter_uuid === encounter.uuid
          );
        });
        if (!_.isNil(referralEncounter)) {
          return this.hasValidVisitInReferredLocation(
            referralEncounter,
            patientEncounters,
            location.uuid
          );
        }
        return false;
      }
      return false;
    }

    return false;
  }

  public hideEncounterModal() {
    this.showReferralEncounterDetail = false;
    this.staticModal.hide();
    this.encounterViewed = true;
    this.selectedEncounter = null;
  }

  public toggleDetailEncounter() {
    this.showVisitEncounterDetail = this.showReferralEncounterDetail;
    this.showReferralEncounterDetail = !this.showVisitEncounterDetail;
  }

  public onAddBackground(color) {
    setTimeout(() => {
      this.addBackground = color;
    });
  }
  public getReferralLocation(enrolledPrograms: any[]) {
    const programBatch: Array<Observable<any>> = [];
    const location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    _.each(enrolledPrograms, (program) => {
      programBatch.push(
        this.getReferralByLocation(location.uuid, program.enrolledProgram.uuid)
      );
    });

    return observableForkJoin(programBatch);
  }

  public getReferralByLocation(
    locationUuid: string,
    enrollmentUuid: string
  ): Observable<any> {
    return Observable.create((observer: BehaviorSubject<any[]>) => {
      this.patientReferralService
        .getReferredByLocation(locationUuid, enrollmentUuid)
        .subscribe(
          (data) => {
            if (data) {
              observer.next(data);
            }
          },
          (error) => {
            observer.error(error);
          }
        );
    }).first();
  }

  public fetchPatientProgramVisitConfigs() {
    const observer: BehaviorSubject<any[]> = new BehaviorSubject(null);
    this.patientProgramResourceService
      .getPatientProgramVisitConfigs(this.patient.uuid)
      .pipe(take(1))
      .subscribe(
        (programConfigs) => {
          observer.next(programConfigs);
        },
        (error) => {
          observer.next(error);
        }
      );
    return observer;
  }

  public filterRequiredEnrollmentForms(program): string[] {
    const _program: any = this.allProgramVisitConfigs[program.programUuid];
    if (
      _program &&
      !_.isUndefined(_program.enrollmentOptions) &&
      !_.isUndefined(_program.enrollmentOptions.stateChangeEncounterTypes)
    ) {
      const encounterTypes =
        _program.enrollmentOptions.stateChangeEncounterTypes.referral;
      return _.map(_.filter(encounterTypes, "required"), "uuid");
    }
    return [];
  }

  public loadProgramManager() {
    this.router.navigate([
      "/patient-dashboard/patient/" +
        this.patient.uuid +
        "/general/general/program-manager/new-program",
    ]);
  }

  public viewSummary(program) {
    const url = program.buttons.landing.url;
    this.router.navigate([url], {});
  }

  private hasValidVisitInReferredLocation(
    referralEncounter: any,
    encounters: any[],
    locationUuid: string
  ) {
    // search for visit encounters who's location is the referred to location
    const encounterWithVisit = _.find(encounters, (encounter) => {
      return (
        !_.isNull(encounter.visit) &&
        encounter.visit.location.uuid === locationUuid
      );
    });
    if (!_.isNil(encounterWithVisit)) {
      // visit date must be after the referral encounter date
      return moment(encounterWithVisit.visit.startDatetime).isAfter(
        moment(referralEncounter.encounterDatetime)
      );
    }
    return false;
  }

  private loadProgramBatch(): void {
    this._resetVariables();
    this.programsBusy = true;
    const sub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        console.log(patient);
        if (patient) {
          this.programsBusy = false;
          this.patient = patient;
          this.loadVitals(this.patient, 0);
          this.setLastEnrolledPrograms();
          this.enrolledProgrames = _.filter(
            patient.enrolledPrograms,
            "isEnrolled"
          );
          console.log(this.enrolledProgrames);
          // this.checkPatientReferrals();
        }
      },
      (err) => {
        this.hasError = true;
        this.errors.push({
          id: "Patient Care Programs",
          message: "error fetching available programs",
          error: err,
        });
        this.programsBusy = false;
      }
    );

    this.subscriptions.push(sub);
  }

  private setLastEnrolledPrograms() {
    const completedPrograms = _.filter(
      this.patient.enrolledPrograms,
      "dateCompleted"
    );
    const programGroup: any = _.groupBy(completedPrograms, "baseRoute");
    const newArr = [];
    if (programGroup.screening) {
      newArr.push(_.max(programGroup.screening));
    }
    if (programGroup.treatment) {
      newArr.push(_.max(programGroup.treatment));
    }
    if (programGroup.research) {
      newArr.push(_.max(programGroup.research));
    }
    this.lastEnrolledPrograms = newArr;
  }

  private checkPatientReferrals() {
    this.getReferralLocation(this.enrolledProgrames)
      .pipe(take(1))
      .subscribe(
        (reply: any[]) => {
          if (_.filter(reply, (v) => !_.isEmpty(v)).length > 0) {
            this.fetchPatientProgramVisitConfigs().subscribe(
              (configs) => {
                if (configs) {
                  this.allProgramVisitConfigs = configs;
                  _.each(this.enrolledProgrames, (program, index) => {
                    const referral = reply[index];
                    if (referral) {
                      _.extend(program, referral, {
                        referral_completed: !_.isNil(
                          referral.notification_status
                        ),
                      });
                      if (this.patientHasBeenSeenInProgram(program)) {
                        program.referral_completed = true;
                        this.updateReferalNotificationStatus(program)
                          .pipe(take(1))
                          .subscribe(() => {});
                      }
                    }
                  });
                }
              },
              (error) => {
                this.programsBusy = false;
                // little importance in communicating this error to the user
                console.error("Error fetching program configs", error);
              }
            );
          } else {
            this._resetVariables();
          }
        },
        (err) => {
          console.log(err);
          // little importance in communicating this error to the user
          this.programsBusy = false;
        }
      );
  }

  private updateReferalNotificationStatus(program) {
    return this.patientReferralService.updateReferalNotificationStatus({
      patient_referral_id: program.patient_referral_id,
      notificationStatus: 1,
    });
  }

  private _resetVariables() {
    this.programsBusy = false;
    this.hasError = false;
    this.errors = [];
  }
}
