/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field10Props {
  data?: Ifield10Data | string;
}

export interface Ifield10Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield10: Ifield10Data = {
  fieldName: 'Integer Number Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter an integer number',
  fieldType: 'INTNUMBER',
};


