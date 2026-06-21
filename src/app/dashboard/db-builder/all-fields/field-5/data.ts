/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field5Props {
  data?: Ifield5Data | string;
}

export interface Ifield5Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield5: Ifield5Data = {
  fieldName: 'Select Field',
  fieldData: '',
  fieldPlaceHolder: 'Select an option',
  fieldType: 'SELECT',
  fieldOptions: ['Option 1', 'Option 2', 'Option 3'],
};
