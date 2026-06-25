/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import TimeField from '@/components/dashboard-ui/TimeField';

import { field14Props, Ifield14Data } from './data';

interface UpdateProps extends field14Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield14Data = {
  fieldName: 'Time Field',
  fieldData: '',
  fieldPlaceHolder: 'Select time',
  fieldType: 'TIME',
};

const resolveData = (data?: Ifield14Data | string): Ifield14Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield14Data;
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
    <TimeField
      id={fieldId}
      value={value}
      placeholder={fieldData.fieldPlaceHolder}
      onChange={next => onChange?.(next || '')}
    />
  );
};
export default Update;


