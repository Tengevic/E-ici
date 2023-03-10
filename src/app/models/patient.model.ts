/**
 * patient
 */
import {BaseModel} from './base-model.model';
import {serializable} from './serializable.decorator';
import {Person} from './person.model';
import {PatientIdentifier} from './patient-identifier.model';

export class Patient extends BaseModel {
  public _identifier = this.openmrsModel.identifiers;
  private _person: Person;
  private _patientIdentifier: PatientIdentifier;
  private _enrolledPrograms = this.openmrsModel.enrolledPrograms;
  private _encounters = this.openmrsModel.encounters;

  constructor(openmrsModel?: any) {
    super(openmrsModel);
  }

  @serializable(true, false)
  public get person(): Person {
    if (this._person === null || this._person === undefined) {
      this.initializeNavigationProperty('person');
      this._person = new Person(this._openmrsModel.person);
    }
    return this._person;
  }

  public set person(v: Person) {
    this._openmrsModel.person = v.openmrsModel;
    this._person = v;
  }

  @serializable()
  public get identifiers(): PatientIdentifier {
    if (this._patientIdentifier === null || this._patientIdentifier === undefined) {
      this.initializeNavigationProperty('patientIdentifier');
      this._patientIdentifier = new PatientIdentifier(this._openmrsModel.identifiers);
    }
    return this._patientIdentifier;
  }

  public set identifiers(v: PatientIdentifier) {
    this._openmrsModel.identifiers = v.openmrsModel;
    this._patientIdentifier = v;
  }

  @serializable()
  public get enrolledPrograms(): any[] {
    if (this._enrolledPrograms === null || this._enrolledPrograms === undefined) {
      this.initializeNavigationProperty('enrolledPrograms');
      this._enrolledPrograms = this._openmrsModel.enrolledPrograms;
    }
    return this._enrolledPrograms;
  }

  public set enrolledPrograms(v: any[]) {
    this._openmrsModel.enrolledPrograms = v;
    this._enrolledPrograms = v;
  }

  public get encounters() {

    const mappedEncounters: Array<any> = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this._encounters.length; i++) {
      mappedEncounters.push(this._encounters[i]);
    }
    return mappedEncounters.reverse();
  }

  public set encounters(encounters: any[]) {
    this._encounters = encounters;
  }

  public get allIdentifiers() {
    if (this._identifier.length > 0) {
      return this._identifier.map(id => id.identifier).toString();
    }
    return '';
  }


  public get searchIdentifiers() {

    if (this._identifier.length > 0) {
      // return _identifier[0].display.split('=')[1];
      let filteredIdentifiers: any;
      const identifier = this._identifier;
      const kenyaNationalId = this.getIdentifierByType(identifier, 'KENYAN NATIONAL ID NUMBER');
      const EICI_Id = this.getIdentifierByType(identifier, 'EICI Universal ID');
      if ((kenyaNationalId) === undefined && (EICI_Id)) {
        if ((this._identifier[0].identifier)) {
          filteredIdentifiers = {'default': this._identifier[0].identifier};
        } else {
          filteredIdentifiers = {'default': ''};
        }
      } else {
        filteredIdentifiers = {
          'kenyaNationalId': kenyaNationalId,
          'EICI_Id': EICI_Id
        };
      }
      return filteredIdentifiers;
    } else {
      return this._identifier = '';
    }

  }

  public get commonIdentifiers() {

    if (this._identifier.length > 0) {
      // return _identifier[0].display.split('=')[1];

      let filteredIdentifiers: any;
      const identifiers = this._identifier;

      const kenyaNationalId = this.getAllIdentifiersByType(identifiers, 'KENYAN NATIONAL ID NUMBER');
      const EICI_Id = this.getAllIdentifiersByType(identifiers, 'ICIMRS Medical Record Number');

      if ((kenyaNationalId) === undefined && (EICI_Id) === undefined) {
        if ((this._identifier[0].identifier)) {
          filteredIdentifiers = {'default': this._identifier[0].identifier};
        } else {
          filteredIdentifiers = {'default': ''};
        }
      } else {
        filteredIdentifiers = {
          'kenyaNationalId': this._fromArrayToCommaSeparatedString(kenyaNationalId),
          'EICI_Id': this._fromArrayToCommaSeparatedString(EICI_Id),
        };
      }
      return filteredIdentifiers;
    } else {
      return this._identifier = '';
    }

  }

  public toUpdatePayload(): any {
    return null;
  }

  public getIdentifierByType(identifierObject, type) {
    for (const e in identifierObject) {
      if ((identifierObject[e].identifierType) !== undefined) {
        const idType = identifierObject[e].identifierType.name;
        const id = identifierObject[e].identifier;
        if (idType === type) {
          return id;
        }
      }
    }
  }

  public getAllIdentifiersByType(identifiers, type) {
    const types = [];
    for (const e in identifiers) {
      if ((identifiers[e].identifierType) !== undefined) {
        const idType = identifiers[e].identifierType.name;
        const id = identifiers[e].identifier;
        if (idType === type) {
          types.push(id);
        }
      }
    }

    return types;
  }

  private _fromArrayToCommaSeparatedString(inputArray) {
    let returnString = '';

    for (let i = 0; i < inputArray.length; i++) {
      if (i === 0) {
        returnString = inputArray[i] + returnString;
      } else {
        returnString = returnString + ', ' + inputArray[i];
      }
    }
    return returnString;
  }

}
