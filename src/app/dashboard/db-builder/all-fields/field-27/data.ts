/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field27Props {
  data?: Ifield27Data | string;
}

export interface Ifield27Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield27: Ifield27Data = {
  fieldName: 'JSON Value Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter JSON value',
  fieldType: 'JsonValueField',
};
