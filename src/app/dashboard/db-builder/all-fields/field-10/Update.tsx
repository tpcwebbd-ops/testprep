/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import NumberInputFieldInteger from '@/components/dashboard-ui/NumberInputFieldInteger';

import { field10Props, Ifield10Data } from './data';

interface UpdateProps extends field10Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield10Data = {
  fieldName: 'Integer Number Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter an integer number',
  fieldType: 'INTNUMBER',
};

const resolveData = (data?: Ifield10Data | string): Ifield10Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield10Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const Update = ({ data, value = '', onChange }: UpdateProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : 0;

  return (
    <NumberInputFieldInteger
      id={fieldId}
      value={numericValue}
      onChange={next => onChange?.(String(next))}
    />
  );
};
export default Update;


