/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { SelectField } from '@/components/dashboard-ui/SelectField';

import { field5Props, Ifield5Data } from './data';

interface AddProps extends field5Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield5Data = {
  fieldName: 'Select Field',
  fieldData: '',
  fieldPlaceHolder: 'Select an option',
  fieldType: 'SELECT',
};

const resolveData = (data?: Ifield5Data | string): Ifield5Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield5Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const Add = ({ data, value = '', onChange }: AddProps) => {
  const fieldData = resolveData(data);
  const options = (fieldData.fieldOptions?.length ? fieldData.fieldOptions : ['Option 1', 'Option 2', 'Option 3']).map(option => ({
    label: option,
    value: option,
  }));

  return (
    <SelectField
      value={value}
      placeholder={fieldData.fieldPlaceHolder}
      options={options}
      onValueChange={next => onChange?.(next)}
    />
  );
};
export default Add;


