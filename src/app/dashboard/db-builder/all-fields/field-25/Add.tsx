/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import MultiOptionsField from '@/components/dashboard-ui/MultiOptionsField';

import { field25Props, Ifield25Data } from './data';

interface AddProps extends field25Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield25Data = {
  fieldName: 'Multi Options Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter multiple options',
  fieldType: 'MULTIOPTIONS',
};

const resolveData = (data?: Ifield25Data | string): Ifield25Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield25Data;
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

const Add = ({ data, value = '', onChange }: AddProps) => {
  const fieldData = resolveData(data);
  const options = (fieldData.fieldOptions?.length ? fieldData.fieldOptions : ['O 1', 'O 2', 'O 3', 'O 4']).map(option => ({
    label: option,
    value: option,
  }));

  return (
    <MultiOptionsField
      options={options}
      value={parseMultiValue(value)}
      onChange={next => onChange?.(JSON.stringify(next))}
    />
  );
};
export default Add;


