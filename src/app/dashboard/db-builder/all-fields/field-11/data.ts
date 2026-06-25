/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field11Props {
  data?: Ifield11Data | string;
}

export interface Ifield11Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield11: Ifield11Data = {
  fieldName: 'Float Number Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter a decimal number',
  fieldType: 'FLOATNUMBER',
};


