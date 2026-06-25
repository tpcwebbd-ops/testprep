/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field16Props {
  data?: Ifield16Data | string;
}

export interface Ifield16Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield16: Ifield16Data = {
  fieldName: 'Time Range Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter start and end time',
  fieldType: 'TIMERANGE',
};


