/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field6Props {
  data?: Ifield6Data | string;
}

export interface Ifield6Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield6: Ifield6Data = {
  fieldName: 'Dynamic Select Field',
  fieldData: '',
  fieldPlaceHolder: 'Select dynamic values',
  fieldType: 'DYNAMICSELECT',
  fieldOptions: ['Option 1', 'Option 2', 'Option 3'],
};
