/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import ColorPickerField from '@/components/dashboard-ui/ColorPickerField';

import { field17Props, Ifield17Data } from './data';

interface UpdateProps extends field17Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield17Data = {
  fieldName: 'Color Picker Field',
  fieldData: '',
  fieldPlaceHolder: 'Choose color',
  fieldType: 'COLORPICKER',
};

const resolveData = (data?: Ifield17Data | string): Ifield17Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield17Data;
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
    <ColorPickerField
      id={fieldId}
      value={value}
      onChange={next => onChange?.(next)}
    />
  );
};
export default Update;


