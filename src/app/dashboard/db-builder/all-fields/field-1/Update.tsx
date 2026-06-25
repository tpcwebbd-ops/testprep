/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import InputFieldForString from '@/components/dashboard-ui/InputFieldForString';

import { field1Props, Ifield1Data } from './data';

interface UpdateProps extends field1Props {
  value?: string;
  onChange?: (value: string) => void;
}

const resolveData = (data?: Ifield1Data | string): Ifield1Data => {
  if (!data) return { fieldName: 'Input Field', fieldData: '', fieldPlaceHolder: 'Enter your name', fieldType: 'STRING' };
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield1Data;
    } catch {
      return { fieldName: 'Input Field', fieldData: '', fieldPlaceHolder: data, fieldType: 'STRING' };
    }
  }
  return data;
};

const Update = ({ data, value = '', onChange }: UpdateProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');

  return (
    <InputFieldForString
      id={fieldId}
      value={value}
      onChange={next => onChange?.(next)}
      placeholder={fieldData.fieldPlaceHolder}
      className="text-white"
    />
  );
};
export default Update;
