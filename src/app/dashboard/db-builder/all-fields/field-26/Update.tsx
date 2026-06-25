/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import StudentsField from './StudentsField';
import { parseStudentsValue, stringifyStudentsValue } from './students-utils';

import { field26Props, Ifield26Data } from './data';

interface UpdateProps extends field26Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield26Data = {
  fieldName: 'String Array Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter items separated by comma',
  fieldType: 'STRINGARRAY',
};

const resolveData = (data?: Ifield26Data | string): Ifield26Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield26Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const Update = ({ data, value = '', onChange }: UpdateProps) => {
  resolveData(data);

  return <StudentsField value={parseStudentsValue(value)} onChange={next => onChange?.(stringifyStudentsValue(next))} />;
};
export default Update;


