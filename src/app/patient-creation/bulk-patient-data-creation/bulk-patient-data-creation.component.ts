import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { Patient } from 'src/app/models/patient.model';
import { PatientCreationService } from '../patient-creation.service';
import { PatientCreationResourceService } from 'src/app/openmrs-api/patient-creation-resource.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { take } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProgramManagerService } from 'src/app/program-manager/program-manager.service';
import { PatientSearchService } from 'src/app/patient-search/patient-search.service';


@Component({
  selector: 'app-bulk-patient-data-creation',
  templateUrl: './bulk-patient-data-creation.component.html',
  styleUrls: ['./bulk-patient-data-creation.component.css']
})
export class BulkPatientDataCreationComponent implements OnInit {
  public persons: any;
  public patients: Patient[];
  public referred: any[] = [];
  public errors: any[] = [];
  public isResetButton = true;
  public totalPatients: number;
  public isLoading = false;
  public dataLoaded = false;
  public hasConductedSearch = false;
  public page = 1;
  public adjustInputMargin = '240px';
  public subscription: Subscription;
  public referralSubscription: Subscription;
  public title = 'Patient Search';
  public errorMessage = '';
  public noMatchingResults = false;
  public lastSearchString = '';
  public providerUuid = '';
  public userId;
  public payloads: any = [];
  public failedPayloads: any = [];

  constructor(
    private patientCreationService: PatientCreationService,
    private patientSearchService: PatientSearchService,
    private patientCreationResourceService: PatientCreationResourceService,
    private userService: UserService,
    private programManagerService: ProgramManagerService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.userId = this.userService.getLoggedInUser().openmrsModel.systemId;
  }
  onFileChange(ev, datatype) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      if (datatype === 'patient') {
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        if (jsonData.data) {
          this.persons = jsonData.data;
          this.createPatients(this.persons);
          console.log(this.persons);
        }
      } else if (datatype === 'programs') {
        const patientNprograms = JSON.parse(data.toString());
        patientNprograms.forEach(enrolledPrograms => {
          //  console.log(patientNpg);
          this.searchPatient(enrolledPrograms);
        });
      } else if ( datatype === 'encounter') {
        const patientNecounters = JSON.parse(data.toString());
        patientNecounters.forEach(patientEncounter => {
          console.log(patientEncounter);
        });
      }
    };
    reader.readAsBinaryString(file);
  }
  public createPatients(patient) {
    patient.forEach(person => {
      // generating identifiers
      const ids = [];
      const attributes = [];
      this.patientCreationService.generateIdentifier(this.userId).pipe(take(1)).subscribe((data: any) => {
        console.log(person.HospitalNumber);
        if (data) {
          ids.push({
            identifierType: '58a4732e-1359-11df-a1f1-0026b9348838',
            identifier: data.identifier,
            location: '7bc85590-2de6-4780-b4d8-f167b71c1834',
            preferred: true
          });
        }
        if (person.KenyaNationalId) {
          ids.push({
            identifierType: '58a47054-1359-11df-a1f1-0026b934883',
            identifier: person.KenyaNationalId,
            location: '7bc85590-2de6-4780-b4d8-f167b71c1834',
            preferred: false
          });
        }
        if (person.HospitalNumber) {
          ids.push({
            identifierType: '3dd5882d-6de9-4784-b350-79c0d3da3883',
            identifier: person.HospitalNumber,
            location: '7bc85590-2de6-4780-b4d8-f167b71c1834',
            preferred: false
          });

        }
      });
      // this.errorAlert = false;
      // setting up identifiers


      if (person.patientPhoneNumber) {
        attributes.push({
          value: person.patientPhoneNumber,
          attributeType: '72a759a8-1359-11df-a1f1-0026b9348838'
        });
      }
      if (person.alternativePhoneNumber) {
        attributes.push({
          value: person.alternativePhoneNumber,
          attributeType: 'c725f524-c14a-4468-ac19-4a0e6661c930'
        });
      }
      if (person.partnerPhoneNumber) {
        attributes.push({
          value: person.partnerPhoneNumber,
          attributeType: 'b0a08406-09c0-4f8b-8cb5-b22b6d4a8e46'
        });
      }
      if (person.nextofkinPhoneNumber) {
        attributes.push({
          value: person.nextofkinPhoneNumber,
          attributeType: 'a657a4f1-9c0f-444b-a1fd-445bb91dd12d'
        });
      }
      const dateFormat = 'MMM dd, yyyy';
      const payload = {
        person: {
          names: [{
            givenName: person.givenName,
            middleName: person.middleName,
            familyName: person.familyName
          }],
          gender: person.gender,
          birthdate: person.birthDate,
          birthdateEstimated: person.birthdateEstimated,
          attributes: attributes,
          dead: person.dead,
          deathDate: person.deathDate,
          deathdateEstimated: person.deathdateEstimated,
          causeOfDeath: person.causeOfDeath,
          dateCreated: person.dateCreated,
          // creator: this.getCreator(person.creatorName),
          addresses: [{
            address1: person.address1 || null,
            address2: person.address2 || null,
            address3: person.address3 || null,
            address4: person.address4,
            address5: person.address5,
            address6: person.address6,
            address7: person.address7,
            address8: person.address8,
            address9: person.address9,
            address10: person.address10,
            address11: person.address11,
            address12: person.address12,
            address13: person.address13,
            address14: person.address14,
            address15: person.address15,
            cityVillage: person.cityVillage,
            latitude: person.latitude,
            longitude: person.longitude,
            stateProvince: person.stateProvince
          }]
        },
        identifiers: ids
      };
      setTimeout(() => {
        this.payloads.push(payload);
      }, 300);
    });
  }
  public uploadPatients() {
    let count = 0;
    console.log(this.payloads);
    this.payloads.forEach(payload => {
      setTimeout(() => {
        count = count + 1;
        console.log('count')
        this.createNewPatient(payload);
      }, 200);
    });
  }
  public createNewPatient(payload) {
    this.patientCreationResourceService.savePatient(payload).pipe(
      take(1)).subscribe((success) => {
        if (success) {
          console.log('patient created')
        }
      }, (err) => {
        this.failedPayloads.push(payload);
        console.log('error', payload);
      });
  }
  public getCreator(userName) {
    console.log(userName);
    // only use on kakamega
    this.userService
      .searchUsers(userName).pipe(
        take(1)).subscribe((results) => {
          if (results[0] && results[0].uuid) {
            console.log(results[0].uuid);
            return results[0].uuid;
          } else {
            return '6564deb6-46ae-4b0d-af15-8fb31bde6c9b';
          }
        });


  }
  public createFailedSheet() {
    console.log(this.failedPayloads, 'failed');
  }
  public enrollPatientToProgram(program, patientuuid) {
    // console.log(program.location.uuid);
    // console.log(patientuuid);
    const payload = {
      programUuid: program.program.uuid,
      patient: {
        person: {
          uuid: patientuuid
        }
      },
      dateEnrolled: program.dateEnrolled,
      dateCompleted: program.dateCompleted,
      location: '7bc85590-2de6-4780-b4d8-f167b71c1834',
      enrollmentUuid: ''
    };
    //  console.log(program.dateCompleted);
    //  console.log(program.program);
    this.enrollUpdatePatientProgram(payload, patientuuid);
    // console.log(enrollment);

  }
  public enrollUpdatePatientProgram(payload, patientuuid) {
    this.programManagerService.enrollPatient(payload).subscribe((enrollment) => {
      if (payload.dateCompleted) {

        const dateCompletedPayload =
        {
          programUuid: payload.programUuid,
          patient: {
            person: {
              uuid: patientuuid
            }
          },
          dateCompleted: payload.dateCompleted,
          dateEnrolled: payload.dateEnrolled,
          location: '7bc85590-2de6-4780-b4d8-f167b71c1834',
          enrollmentUuid: enrollment.uuid
        };
        this.programManagerService.enrollPatient(dateCompletedPayload).subscribe((dateCompletedPayload) => { });
        // this.enrollPatientToProgram(, patientuuid)
      };

    });

  }
  public searchPatient(patient) {
    // console.log(patient);
    if (patient.programs.length > 0) {
      // console.log(patient.programs[0]._openmrsModel.patient.person.preferredName.display);
      setTimeout(() => {
        this.patientSearchService.searchPatient(patient.programs[0]._openmrsModel.patient.person.preferredName.display, false)
          .subscribe(
            (data) => {
              if (data.length !== 0) {
                patient.programs.forEach(program => {
                  if (data.length == 1) {
                    // console.log(program._openmrsModel);
                    this.enrollPatientToProgram(program._openmrsModel, data[0].uuid);

                  } else {
                    data.forEach(patientFound => {
                      this.enrollPatientToProgram(program._openmrsModel, patientFound.uuid)
                    });
                  }
                });

              } else {
              }
            },
            (error) => {
            }
          );
      }, 500);
    }

    // setTimeout(() => {
    //   this.patientSearchService.searchPatient(patient.Name, false)
    //     .subscribe(
    //       (data) => {
    //         if (data.length !== 0) {

    //           console.log(patient.Name, 'found')
    //           const dateFormat = 'MMM dd, yyyy';
    //         } else {
    //         }
    //       },
    //       (error) => {
    //       }
    //     );
    // }, 500);
  }
  public extractVisits() {
    //get & create patient visits
    console.log()
    //get and create patient encounters & Obs then attach obs to visit

    //close visits

    //get and create patient

  }
}
