/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field23Props {
  data?: Ifield23Data | string;
}

export interface Ifield23Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield23: Ifield23Data = {
  fieldName: 'Checkbox Field',
  fieldData: '',
  fieldPlaceHolder: 'Check the value',
  fieldType: 'CHECKBOX',
};
