import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { PatientSearchService } from 'src/app/patient-search/patient-search.service';
import { ExportService } from '../export.service';

@Component({
  selector: 'app-bulk-patient',
  templateUrl: './bulk-patient.component.html',
  styleUrls: ['./bulk-patient.component.css']
})
export class BulkPatientComponent implements OnInit {
  public patientes: any[] = [];
  public patientsMissing = 0;

  constructor(
    private patientSearchService: PatientSearchService,
    private exportService: ExportService
  ) { }

  ngOnInit() {
  }
  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      if (jsonData.data) {
    //  console.log(jsonData.data);
     setTimeout(() => {
      jsonData.data.forEach(patient => {
        // console.log(patient.AMRSNumber);'
        setTimeout(() => {
        this.searchPatient(patient);
        // currentSorted++;
      }, 3000);
      });
    }, 500);
        // this.createPatients(this.persons);
        
        // console.log(this.persons);
      }
    }
    reader.readAsBinaryString(file);
  }
   public searchPatient(patient) {
    // this.totalPatients = 0;
    // if (this.subscription) {
    //    this.subscription.unsubscribe();
    // }
    // if (window.innerWidth > 768) {
    //   this.adjustInputMargin = '267px';
    // }
    setTimeout(() => {
      this.patientSearchService.searchPatient(patient.Name, false)
        .subscribe(
          (data) => {
            if (data.length !== 0) {
              console.log(patient.Name, 'found')
              // console.log(data[0].person.preferredAddress);\
              const dateFormat = 'MMM dd, yyyy';
              // console.log(data[0].person.deathDateEstimated);
              // const person = {
              //   givenName: (data[0].person.preferredName as any).givenName,
              //   middleName: (data[0].person.preferredName as any).middleName,
              //   familyName: (data[0].person.preferredName as any).familyName,
              //   birthDate: moment(data[0].person.birthdate).format(),
              //   birthdateEstimated: data[0].person.birthdateEstimated,
              //   ispreferred: (data[0].person.preferredName as any).preferred,
              //   preferredNameuuid: (data[0].person.preferredName as any).uuid,
              //   healthCenter: data[0].person.healthCenter,
              //   dead: data[0].person.dead,
              //   deathDate: data[0].person.deathDate,
              //   causeOfDeath: data[0].person.causeOfDeathUuId,
              //   deathdateEstimated: data[0].person.deathDateEstimated,
              //   name: data[0].person.display,
              //   gender: data[0].person.gender,
              //   age: data[0].person.age,
              //   ampathMrsUId: data[0].searchIdentifiers.ampathMrsUId || null,
              //   amrsMrn: data[0].searchIdentifiers.ampathMrsUId || null,
              //   cCC: data[0].searchIdentifiers.cCC || null,
              //   HospitalNumber: patientIdentifier,
              //   kenyaNationalId: data[0].searchIdentifiers.kenyaNationalId || null,
              //   nextofkinPhoneNumber: data[0].person.nextofkinPhoneNumber,
              //   patnerPhoneNumber: data[0].person.patnerPhoneNumber,
              //   patientPhoneNumber: data[0].person.patientPhoneNumber,
              //   alternativePhoneNumber: data[0].person.alternativePhoneNumber,
              //   address1: (data[0].person.preferredAddress as any).address1 || null,
              //   address2: (data[0].person.preferredAddress as any).address2 || null,
              //   address3: (data[0].person.preferredAddress as any).address3 || null,
              //   address4: (data[0].person.preferredAddress as any).address13 || null,
              //   address5: (data[0].person.preferredAddress as any).address13 || null,
              //   address6: (data[0].person.preferredAddress as any).address6 || null,
              //   address7: (data[0].person.preferredAddress as any).address7 || null,
              //   address8: (data[0].person.preferredAddress as any).address8 || null,
              //   address9: (data[0].person.preferredAddress as any).address9 || null,
              //   address10: (data[0].person.preferredAddress as any).address10 || null,
              //   address11: (data[0].person.preferredAddress as any).address11 || null,
              //   address12: (data[0].person.preferredAddress as any).address12 || null,
              //   address13: (data[0].person.preferredAddress as any).address13 || null,
              //   address14: (data[0].person.preferredAddress as any).address14 || null,
              //   address15: (data[0].person.preferredAddress as any).address15 || null,
              //   cityVillage: (data[0].person.preferredAddress as any).cityVillage || null,
              //   stateProvince: (data[0].person.preferredAddress as any).stateProvince || null,
              //   latitude: (data[0].person.preferredAddress as any).latitude || null,
              //   longitude: (data[0].person.preferredAddress as any).longitude || null,
              //   creator: data[0].person.auditInfo.creator.uuid || null,
              //   creatorName: data[0].person.auditInfo.creator.display,
              //   dateCreated: moment(data[0].person.datePatientCreated).format()
              // };
              // console.log(data);
              // console.log(person);
              // this.patientes.push(person);
              // this.patientList = this.patientes;
              // this.patients = this.patientes;
              // if
              // console.log(this.patientes);
            } else {
              this.patientsMissing = this.patientsMissing + 1;
              console.log(patient.Name,'notfound', this.patientsMissing);
              this.patientes.push(patient);
            }
            // console.log(this.patientes);
          },
          (error) => {
            // this.onError(error);
          }
        );
    }, 500);
    // this.isResetButton = true;
  }
  public export() {
    console.log(this.patientes);
    this.exportService.exportExcel(this.patientes, 'pat');
  }
}
