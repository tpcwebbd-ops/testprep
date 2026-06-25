/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import NumberInputFieldFloat from '@/components/dashboard-ui/NumberInputFieldFloat';

import { field11Props, Ifield11Data } from './data';

interface AddProps extends field11Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield11Data = {
  fieldName: 'Float Number Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter a decimal number',
  fieldType: 'FLOATNUMBER',
};

const resolveData = (data?: Ifield11Data | string): Ifield11Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield11Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const Add = ({ data, value = '', onChange }: AddProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : 0;

  return (
    <NumberInputFieldFloat
      id={fieldId}
      value={numericValue}
      onChange={next => onChange?.(String(next))}
    />
  );
};
export default Add;


