/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface field1Props {
  data?: Ifield1Data | string;
}

export interface Ifield1Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
}

export const defaultDatafield1: Ifield1Data = {
  fieldName: 'Input Text Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter your text',
};
