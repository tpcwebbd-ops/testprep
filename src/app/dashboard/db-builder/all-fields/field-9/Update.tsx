/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import TextareaFieldForDescription from '@/components/dashboard-ui/TextareaFieldForDescription';

import { field9Props, Ifield9Data } from './data';

interface UpdateProps extends field9Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield9Data = {
  fieldName: 'Description Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter description',
  fieldType: 'DESCRIPTION',
};

const resolveData = (data?: Ifield9Data | string): Ifield9Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield9Data;
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
    <TextareaFieldForDescription
      id={fieldId}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      className="text-white"
    />
  );
};
export default Update;


