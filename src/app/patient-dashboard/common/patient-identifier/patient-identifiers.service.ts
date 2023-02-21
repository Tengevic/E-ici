import { Injectable } from "@angular/core";

@Injectable()
export class PatientIdentifierService {
  public locations: any[];
  constructor() {}
  public getLuhnCheckDigit(numbers) {
    const validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_";
    numbers = numbers.toUpperCase().trim();
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      const ch = numbers.charAt(numbers.length - i - 1);
      if (validChars.indexOf(ch) < 0) {
        console.log("Invalid character(s) found!");
        return false;
      }
      // tslint:disable-next-line:no-shadowed-variable
      const digit = ch.charCodeAt(0) - 48;
      let weight;
      if (i % 2 === 0) {
        const res = digit / 5;
        weight = 2 * digit - parseInt(res.toString(), 10) * 9;
      } else {
        weight = digit;
      }
      sum += weight;
    }
    sum = Math.abs(sum) + 10;
    const digit = (10 - (sum % 10)) % 10;
    console.log("Lunh Check Digit Is =" + digit);
    return digit;
  }

  public checkRegexValidity(expression, identifier) {
    const identifierRegex = new RegExp(expression);
    return identifierRegex.test(identifier);
  }

  public commonIdentifierTypes() {
    return [
      "KENYAN NATIONAL ID NUMBER",
      "ICIMRS Medical Record Number",
      "ICIMRS Universal ID",
      "CCC Number",
      "MTRH Hospital Number",
      "HEI",
      "KUZA ID",
      "Zuri Health ID",
      "NAT",
    ];
  }
  public patientIdentifierTypeFormat() {
    return [
      {
        label: "KENYAN NATIONAL ID NUMBER",
        format: null,
        checkdigit: null,
        val: "58a47054-1359-11df-a1f1-0026b9348839",
      },
      {
        label: "EICI Universal ID",
        format: null,
        checkdigit: 1,
        val: "58a4732e-1359-11df-a1f1-0026b9348838",
      },
      {
        label: "NHIF Number",
        format: null,
        checkdigit: 0,
        val: "7e0b36c0-ad6e-423e-9a0e-f18455bac5d5",
      },
      {
        label: "ICI Clinic Number",
        format: null,
        checkdigit: 0,
        val: "e4207b60-5524-4cea-90cd-3c5549a9c229",
      },
      {
        label: "MeTRH Oncology Clinic Number",
        format: null,
        checkdigit: 0,
        val: "2b02a92f-4ced-4476-9fa4-71f9ed974adb",
      },
      {
        label: "MCRH Hospital Serial Number",
        format: null,
        checkdigit: 0,
        val: "ba747eb3-b1fd-42b9-b073-62e899b51aa1",
      },
      {
        label: "MCRH Hospital IP Number",
        format: null,
        checkdigit: 0,
        val: "e2551010-fc88-4efc-8484-bc0684738cda",
      },
      {
        label: "MCRH VOI Hospital Number",
        format: null,
        checkdigit: 0,
        val: "3b772b5a-87c5-4a0d-ac5c-d9618cb30079",
      },
    ];
  }
}
