/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import InputFieldForPasscode from '@/components/dashboard-ui/InputFieldForPasscode';

import { field4Props, Ifield4Data } from './data';

interface UpdateProps extends field4Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield4Data = {
  fieldName: 'Passcode Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter your passcode',
  fieldType: 'PASSCODE',
};

const resolveData = (data?: Ifield4Data | string): Ifield4Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield4Data;
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
    <InputFieldForPasscode
      id={fieldId}
      value={value}
      onChange={next => onChange?.(next)}
    />
  );
};
export default Update;


