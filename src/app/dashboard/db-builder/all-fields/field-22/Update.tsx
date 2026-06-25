/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { RadioButtonGroupField } from '@/components/dashboard-ui/RadioButtonGroupField';

import { field22Props, Ifield22Data } from './data';

interface UpdateProps extends field22Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield22Data = {
  fieldName: 'Radio Button Field',
  fieldData: '',
  fieldPlaceHolder: 'Choose an option',
  fieldType: 'RADIOBUTTON',
};

const resolveData = (data?: Ifield22Data | string): Ifield22Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield22Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const Update = ({ data, value = '', onChange }: UpdateProps) => {
  const fieldData = resolveData(data);
  const options = (fieldData.fieldOptions?.length ? fieldData.fieldOptions : ['OP 1', 'OP 2', 'OP 3', 'OP 4']).map(option => ({
    label: option,
    value: option,
  }));

  return (
    <RadioButtonGroupField
      options={options}
      value={value}
      onChange={next => onChange?.(next)}
    />
  );
};
export default Update;


