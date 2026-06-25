/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import InputFieldForPassword from '@/components/dashboard-ui/InputFieldForPassword';

import { field3Props, Ifield3Data } from './data';

interface UpdateProps extends field3Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield3Data = {
  fieldName: 'Password Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter your password',
  fieldType: 'PASSWORD',
};

const resolveData = (data?: Ifield3Data | string): Ifield3Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield3Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const Update = ({ data, value = '', onChange }: UpdateProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');

  return (
    <InputFieldForPassword
      id={fieldId}
      value={value}
      onChange={next => onChange?.(next)}
    />
  );
};
export default Update;


