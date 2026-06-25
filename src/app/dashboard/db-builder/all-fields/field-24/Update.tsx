/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import MultiCheckboxGroupField from '@/components/dashboard-ui/MultiCheckboxGroupField';

import { field24Props, Ifield24Data } from './data';

interface UpdateProps extends field24Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield24Data = {
  fieldName: 'Multi Checkbox Field',
  fieldData: '',
  fieldPlaceHolder: 'Choose multiple options',
  fieldType: 'MULTICHECKBOX',
};

const resolveData = (data?: Ifield24Data | string): Ifield24Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield24Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const parseMultiValue = (value: string): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
};

const Update = ({ data, value = '', onChange }: UpdateProps) => {
  const fieldData = resolveData(data);
  const options = fieldData.fieldOptions?.map(option => ({ label: option, value: option }));

  return (
    <MultiCheckboxGroupField
      value={parseMultiValue(value)}
      options={options}
      onChange={next => onChange?.(JSON.stringify(next))}
    />
  );
};
export default Update;


