/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

export interface field25Props {
  data?: Ifield25Data | string;
}

export interface Ifield25Data {
  fieldName: string;
  fieldData: string;
  fieldPlaceHolder: string;
  fieldType: string;
  fieldOptions?: string[];
}

export const defaultDatafield25: Ifield25Data = {
  fieldName: 'Multi Options Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter multiple options',
  fieldType: 'MULTIOPTIONS',
  fieldOptions: ['Option 1', 'Option 2', 'Option 3'],
};
