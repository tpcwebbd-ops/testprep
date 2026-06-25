/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field14Props {
  data?: Ifield14Data | string;
}

export interface Ifield14Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield14: Ifield14Data = {
  fieldName: 'Time Field',
  fieldData: '',
  fieldPlaceHolder: 'Select time',
  fieldType: 'TIME',
};


