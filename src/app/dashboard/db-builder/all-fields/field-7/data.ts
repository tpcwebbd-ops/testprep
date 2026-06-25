/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field7Props {
  data?: Ifield7Data | string;
}

export interface Ifield7Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield7: Ifield7Data = {
  fieldName: 'Images Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter image URLs separated by comma',
  fieldType: 'IMAGES',
};


