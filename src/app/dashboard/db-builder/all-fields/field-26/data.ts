/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field26Props {
  data?: Ifield26Data | string;
}

export interface Ifield26Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield26: Ifield26Data = {
  fieldName: 'String Array Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter items separated by comma',
  fieldType: 'STRINGARRAY',
};
