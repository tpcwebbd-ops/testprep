/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field9Props {
  data?: Ifield9Data | string;
}

export interface Ifield9Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield9: Ifield9Data = {
  fieldName: 'Description Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter description',
  fieldType: 'DESCRIPTION',
};
