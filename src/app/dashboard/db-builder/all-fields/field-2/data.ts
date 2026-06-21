/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export interface field2Props {
  data?: Ifield2Data | string;
}

export interface Ifield2Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
}

export const defaultDatafield2: Ifield2Data = {
  fieldName: 'Input Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter your email',
};
