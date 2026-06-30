/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import RichTextEditorField from '@/components/dashboard-ui/RichTextEditorField';

import { field20Props, Ifield20Data } from './data';

interface UpdateProps extends field20Props {
  value?: string;
  onChange?: (value: string) => void;
}

const fallbackData: Ifield20Data = {
  fieldName: 'Rich Text Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter rich text',
  fieldType: 'RICHTEXT',
};

const resolveData = (data?: Ifield20Data | string): Ifield20Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield20Data;
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
    <div className="w-full min-w-0">
      <RichTextEditorField
        id={fieldId}
        value={value || '<p></p>'}
        onChange={next => onChange?.(next)}
      />
    </div>
  );
};
export default Update;


