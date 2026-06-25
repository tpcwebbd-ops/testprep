/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field13Props {
  data?: Ifield13Data | string;
}

export interface Ifield13Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield13: Ifield13Data = {
  fieldName: 'Date Field',
  fieldData: '',
  fieldPlaceHolder: 'Select date',
  fieldType: 'DATE',
};


