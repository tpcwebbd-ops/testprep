/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import UrlInputField from '@/components/dashboard-ui/UrlInputField';

import { field19Props, Ifield19Data } from './data';

interface UpdateProps extends field19Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield19Data = {
  fieldName: 'URL Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter URL',
  fieldType: 'URL',
};

const resolveData = (data?: Ifield19Data | string): Ifield19Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield19Data;
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
    <UrlInputField
      id={fieldId}
      value={value}
      onChange={next => onChange?.(next)}
    />
  );
};
export default Update;


