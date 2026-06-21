/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field3Props {
  data?: Ifield3Data | string;
}

export interface Ifield3Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield3: Ifield3Data = {
  fieldName: 'Password Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter your password',
  fieldType: 'PASSWORD',
};
