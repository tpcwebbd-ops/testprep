/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field24Props {
  data?: Ifield24Data | string;
}

export interface Ifield24Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield24: Ifield24Data = {
  fieldName: 'Multi Checkbox Field',
  fieldData: '',
  fieldPlaceHolder: 'Choose multiple options',
  fieldType: 'MULTICHECKBOX',
  fieldOptions: ['Option 1', 'Option 2', 'Option 3'],
};
