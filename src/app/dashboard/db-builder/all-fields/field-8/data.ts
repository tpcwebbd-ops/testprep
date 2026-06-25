/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field8Props {
  data?: Ifield8Data | string;
}

export interface Ifield8Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield8: Ifield8Data = {
  fieldName: 'Image Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter image URL',
  fieldType: 'IMAGE',
};


