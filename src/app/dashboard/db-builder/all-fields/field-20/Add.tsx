/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { Input } from '@/components/ui/input';

import { field20Props, Ifield20Data } from './data';

interface AddProps extends field20Props {
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

const getInputType = (fieldType: string) => {
  const normalizedType = fieldType.toLowerCase();
  if (normalizedType.includes('email')) return 'email';
  if (normalizedType.includes('password') || normalizedType.includes('passcode')) return 'password';
  if (normalizedType.includes('number') || normalizedType.includes('int') || normalizedType.includes('float')) return 'number';
  if (normalizedType.includes('date')) return 'date';
  if (normalizedType === 'time') return 'time';
  if (normalizedType.includes('color')) return 'color';
  if (normalizedType.includes('phone')) return 'tel';
  if (normalizedType.includes('url') || normalizedType.includes('image')) return 'url';
  return 'text';
};

const Add = ({ data, value = '', onChange }: AddProps) => {
  const fieldData = resolveData(data);
  const normalizedType = fieldData.fieldType.toLowerCase();

  if (["description","richtext","stringarray","jsonvaluefield","images","daterange","timerange"].includes(normalizedType)) {
    return (
      <textarea
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={fieldData.fieldPlaceHolder}
        className="min-h-24 w-full rounded-sm border border-white/10 bg-white/10 backdrop-blur-md px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
    );
  }

  if (["boolean","checkbox"].includes(normalizedType)) {
    return (
      <label className="flex min-h-10 items-center gap-3 rounded-sm border border-white/10 bg-white/10 backdrop-blur-md px-3 py-2 text-sm text-white">
        <input
          type="checkbox"
          checked={value === 'true'}
          onChange={e => onChange?.(String(e.target.checked))}
          className="h-4 w-4 rounded border-white/10 bg-white/10 backdrop-blur-md"
        />
        {fieldData.fieldPlaceHolder}
      </label>
    );
  }

  if (["select","dynamicselect","radiobutton","multicheckbox","multioptions"].includes(normalizedType)) {
    const options = fieldData.fieldOptions?.length ? fieldData.fieldOptions : ['Option 1', 'Option 2', 'Option 3'];

    return (
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="h-10 w-full rounded-sm border border-white/10 bg-white/10 backdrop-blur-md px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      >
        <option value="">{fieldData.fieldPlaceHolder}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Input
      type={getInputType(fieldData.fieldType)}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={fieldData.fieldPlaceHolder}
      className="bg-white/10 backdrop-blur-md border-white/10 text-white placeholder:text-white/40"
    />
  );
};
export default Add;


