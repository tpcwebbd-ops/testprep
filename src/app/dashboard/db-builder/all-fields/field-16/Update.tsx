/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import TimeRangePickerField from '@/components/dashboard-ui/TimeRangePickerField';

import { field16Props, Ifield16Data } from './data';

interface UpdateProps extends field16Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield16Data = {
  fieldName: 'Time Range Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter start and end time',
  fieldType: 'TIMERANGE',
};

const resolveData = (data?: Ifield16Data | string): Ifield16Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield16Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

type TimeRangeValue = { start: string; end: string };

const parseTimeRange = (value: string): TimeRangeValue | undefined => {
  if (!value.trim()) return undefined;

  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object') {
      return {
        start: typeof parsed.start === 'string' ? parsed.start : '',
        end: typeof parsed.end === 'string' ? parsed.end : '',
      };
    }
  } catch {
    const [start = '', end = ''] = value.split('-').map(item => item.trim());
    return { start, end };
  }

  return undefined;
};

const serializeTimeRange = (range: TimeRangeValue | undefined) => JSON.stringify(range || {});

const Update = ({ data, value = '', onChange }: UpdateProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');

  return (
    <TimeRangePickerField
      id={fieldId}
      value={parseTimeRange(value)}
      onChange={next => onChange?.(serializeTimeRange(next))}
    />
  );
};
export default Update;


