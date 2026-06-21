/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field21Props {
  data?: Ifield21Data | string;
}

export interface Ifield21Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield21: Ifield21Data = {
  fieldName: 'Autocomplete Field',
  fieldData: '',
  fieldPlaceHolder: 'Search or enter value',
  fieldType: 'AUTOCOMPLETE',
};
