/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field20Props {
  data?: Ifield20Data | string;
}

export interface Ifield20Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield20: Ifield20Data = {
  fieldName: 'Rich Text Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter rich text',
  fieldType: 'RICHTEXT',
};


