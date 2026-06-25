/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import DynamicSelectField from '@/components/dashboard-ui/DynamicSelectField';

import { field6Props, Ifield6Data } from './data';

interface UpdateProps extends field6Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield6Data = {
  fieldName: 'Dynamic Select Field',
  fieldData: '',
  fieldPlaceHolder: 'Select dynamic values',
  fieldType: 'DYNAMICSELECT',
};

const resolveData = (data?: Ifield6Data | string): Ifield6Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield6Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const toValueList = (value: string) =>
  value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

const Update = ({ data, value = '', onChange }: UpdateProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');

  return (
    <DynamicSelectField
      id={fieldId}
      label=""
      value={toValueList(value)}
      onChange={next => onChange?.(next.join(', '))}
      apiUrl="https://jsonplaceholder.typicode.com/users"
      placeholder={fieldData.fieldPlaceHolder}
    />
  );
};
export default Update;


