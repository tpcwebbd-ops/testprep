/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field22Props {
  data?: Ifield22Data | string;
}

export interface Ifield22Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield22: Ifield22Data = {
  fieldName: 'Radio Button Field',
  fieldData: '',
  fieldPlaceHolder: 'Choose an option',
  fieldType: 'RADIOBUTTON',
  fieldOptions: ['Option 1', 'Option 2', 'Option 3'],
};
