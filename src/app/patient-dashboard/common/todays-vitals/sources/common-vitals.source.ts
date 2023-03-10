import { Vital } from '../../../../models/vital.model';
import * as _ from 'lodash';
import { Patient } from '../../../../models/patient.model';
import { VitalView } from '../vital-view';
import { VitalSourceInterface } from './vital-source.interface';

export class CommonVitalsSource implements VitalSourceInterface {
  constructor(public vitalModel: any | Vital,
    public patient: Patient) {
  }

  public getVitals(ob: any): VitalView {
    switch (ob.concept.uuid) {
      case '5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
        return this.vitalModel.createVital({
          name: 'systolic',
          label: 'BP:',
          order: 1,
          value: ob.value,
          color: (ob.value <= 80 || ob.value >= 140) ? 'red' : ''
        });
      case '5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
        return this.vitalModel.createVital({
          name: 'diastolic',
          label: 'Diastolic',
          value: ob.value,
          isCompoundedWith: 'systolic',
          color: (ob.value <= 50 || ob.value >= 90) ? 'red' : ''
        });
      case 'a8a65f12-1350-11df-a1f1-0026b9348838':
        return this.vitalModel.createVital({
          name: 'pulse',
          label: 'Pulse:',
          order: 2,
          value: ob.value,
          color: (ob.value >= 100) ? 'red' : ''
        });
      case '5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
        return this.vitalModel.createVital({
          name: 'temperature',
          label: 'Temperature:',
          order: 3,
          value: ob.value,
          color: (ob.value <= 35 || ob.value >= 38) ? 'red' : ''
        });
      // case 'a8a66354-1350-11df-a1f1-0026b9348838':
      //   return this.vitalModel.createVital({
      //     name: 'oxygenSaturation',
      //     label: 'Oxygen Saturation:',
      //     order: 3,
      //     value: ob.value,
      //     color: (ob.value <= 89) ? 'red' : ''
      //   });
      case '5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
        return this.vitalModel.createVital({
          name: 'height',
          label: 'Height:',
          order: 4,
          value: ob.value
        });
      case '5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA':
        return this.vitalModel.createVital({
          name: 'weight',
          label: 'Weight:',
          order: 5,
          value: ob.value
        });
      // case 'a898c87a-1350-11df-a1f1-0026b9348838':
      //   return this.vitalModel.createVital({
      //     name: 'bsa',
      //     label: 'BSA:',
      //     value: (ob.value).toFixed(2)
      //   });
      default:
        return this.vitalModel;
    }
  }

  public getBMI(vitalModel, weight, height) {
    let bmi = null;
    if (height && weight) {
      bmi = (parseInt(weight.value, 10) / (parseInt(height.value, 10) / 100 * height.value / 100)).toFixed(1);
      return vitalModel.createVital({
        name: 'bmi',
        label: 'BMI (Kg/M2)',
        order: 6,
        show: !_.isNil(bmi) && this.patient.person.age > 18,
        value: bmi,
        color: (bmi <= 18 || bmi >= 30) ? 'red' : ''
      }).bmi;
    }
    return this.vitalModel;
  }

  protected toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
