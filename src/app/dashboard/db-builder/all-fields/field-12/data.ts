/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field12Props {
  data?: Ifield12Data | string;
}

export interface Ifield12Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield12: Ifield12Data = {
  fieldName: 'Boolean Field',
  fieldData: '',
  fieldPlaceHolder: 'Choose true or false',
  fieldType: 'BOOLEAN',
};


