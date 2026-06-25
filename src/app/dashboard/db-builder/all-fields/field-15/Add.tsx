/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { DateRange } from 'react-day-picker';
import DateRangePickerField from '@/components/dashboard-ui/DateRangePickerField';

import { field15Props, Ifield15Data } from './data';

interface AddProps extends field15Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield15Data = {
  fieldName: 'Date Range Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter start and end date',
  fieldType: 'DATERANGE',
};

const resolveData = (data?: Ifield15Data | string): Ifield15Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield15Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const parseDateRange = (value: string): DateRange | undefined => {
  if (!value.trim()) return undefined;

  try {
    const parsed = JSON.parse(value);
    const from = parsed?.from ? new Date(parsed.from) : undefined;
    const to = parsed?.to ? new Date(parsed.to) : undefined;

    return {
      from: from && !Number.isNaN(from.getTime()) ? from : undefined,
      to: to && !Number.isNaN(to.getTime()) ? to : undefined,
    };
  } catch {
    return undefined;
  }
};

const serializeDateRange = (range: DateRange | undefined) => JSON.stringify(range || {});

const Add = ({ data, value = '', onChange }: AddProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');

  return (
    <DateRangePickerField
      id={fieldId}
      value={parseDateRange(value)}
      onChange={next => onChange?.(serializeDateRange(next))}
      placeholder={fieldData.fieldPlaceHolder}
    />
  );
};
export default Add;


