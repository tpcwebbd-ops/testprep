/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field19Props {
  data?: Ifield19Data | string;
}

export interface Ifield19Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield19: Ifield19Data = {
  fieldName: 'URL Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter URL',
  fieldType: 'URL',
};
