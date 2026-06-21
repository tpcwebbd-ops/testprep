/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field17Props {
  data?: Ifield17Data | string;
}

export interface Ifield17Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield17: Ifield17Data = {
  fieldName: 'Color Picker Field',
  fieldData: '',
  fieldPlaceHolder: 'Choose color',
  fieldType: 'COLORPICKER',
};
