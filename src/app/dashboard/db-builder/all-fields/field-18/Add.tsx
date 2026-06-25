/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import PhoneInputField from '@/components/dashboard-ui/PhoneInputField';

import { field18Props, Ifield18Data } from './data';

interface AddProps extends field18Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield18Data = {
  fieldName: 'Phone Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter phone number',
  fieldType: 'PHONE',
};

const resolveData = (data?: Ifield18Data | string): Ifield18Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield18Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const Add = ({ data, value = '', onChange }: AddProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');

  return (
    <PhoneInputField
      id={fieldId}
      value={value}
      onChange={next => onChange?.(next)}
    />
  );
};
export default Add;


