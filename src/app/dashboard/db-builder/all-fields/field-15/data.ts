/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field15Props {
  data?: Ifield15Data | string;
}

export interface Ifield15Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield15: Ifield15Data = {
  fieldName: 'Date Range Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter start and end date',
  fieldType: 'DATERANGE',
};


