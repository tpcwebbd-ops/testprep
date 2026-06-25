/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import JsonTextareaField from '@/components/dashboard-ui/JsonTextareaField';

import { field27Props, Ifield27Data } from './data';

interface UpdateProps extends field27Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield27Data = {
  fieldName: 'JSON Value Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter JSON value',
  fieldType: 'JsonValueField',
};

const resolveData = (data?: Ifield27Data | string): Ifield27Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield27Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const formatJsonValue = (value: string) => {
  if (!value) return '{}';
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

const Update = ({ data, value = '', onChange }: UpdateProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');

  return (
    <JsonTextareaField
      id={fieldId}
      value={formatJsonValue(value)}
      onChange={next => onChange?.(JSON.stringify(next))}
    />
  );
};
export default Update;


