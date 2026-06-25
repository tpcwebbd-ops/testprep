/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { CheckboxField } from '@/components/dashboard-ui/CheckboxField';

import { field23Props, Ifield23Data } from './data';

interface UpdateProps extends field23Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield23Data = {
  fieldName: 'Checkbox Field',
  fieldData: '',
  fieldPlaceHolder: 'Check the value',
  fieldType: 'CHECKBOX',
};

const resolveData = (data?: Ifield23Data | string): Ifield23Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield23Data;
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
    <CheckboxField
      id={fieldId}
      checked={value === 'true'}
      onCheckedChange={next => onChange?.(String(next))}
    />
  );
};
export default Update;


