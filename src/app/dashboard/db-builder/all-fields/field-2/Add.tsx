/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import InputFieldForEmail from '@/components/dashboard-ui/InputFieldForEmail';

import { field2Props, Ifield2Data } from './data';

interface AddProps extends field2Props {
  value?: string;
  onChange?: (value: string) => void;
}

const resolveData = (data?: Ifield2Data | string): Ifield2Data => {
  if (!data) return { fieldName: 'Input Field', fieldData: '', fieldPlaceHolder: 'Enter your email', fieldType: 'EMAIL' };
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield2Data;
    } catch {
      return { fieldName: 'Input Field', fieldData: '', fieldPlaceHolder: data, fieldType: 'EMAIL' };
    }
  }
  return data;
};

const Add = ({ data, value = '', onChange }: AddProps) => {
  const fieldData = resolveData(data);
  const fieldId = fieldData.fieldName.toLowerCase().replace(/\s+/g, '-');

  return (
    <InputFieldForEmail
      id={fieldId}
      value={value}
      onChange={next => onChange?.(next)}
      placeholder={fieldData.fieldPlaceHolder}
      className="text-white"
    />
  );
};
export default Add;
