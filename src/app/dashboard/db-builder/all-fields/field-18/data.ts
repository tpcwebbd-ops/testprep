/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field18Props {
  data?: Ifield18Data | string;
}

export interface Ifield18Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield18: Ifield18Data = {
  fieldName: 'Phone Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter phone number',
  fieldType: 'PHONE',
};


