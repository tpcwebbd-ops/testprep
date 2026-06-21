/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field4Props {
  data?: Ifield4Data | string;
}

export interface Ifield4Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield4: Ifield4Data = {
  fieldName: 'Passcode Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter your passcode',
  fieldType: 'PASSCODE',
};
