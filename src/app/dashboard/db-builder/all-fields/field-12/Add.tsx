/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { BooleanInputField } from '@/components/dashboard-ui/BooleanInputField';

import { field12Props, Ifield12Data } from './data';

interface AddProps extends field12Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield12Data = {
  fieldName: 'Boolean Field',
  fieldData: '',
  fieldPlaceHolder: 'Choose true or false',
  fieldType: 'BOOLEAN',
};

const resolveData = (data?: Ifield12Data | string): Ifield12Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield12Data;
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
    <BooleanInputField
      id={fieldId}
      checked={value === 'true'}
      onCheckedChange={next => onChange?.(String(next))}
    />
  );
};
export default Add;


