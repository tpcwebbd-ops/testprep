/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { Input } from '@/components/ui/input';

import { field1Props, Ifield1Data } from './data';

interface UpdateProps extends field1Props {
  value?: string;
  onChange?: (value: string) => void;
}

const resolveData = (data?: Ifield1Data | string): Ifield1Data => {
  if (!data) return { fieldName: 'Input Field', fieldData: '', fieldPlaceHolder: 'Enter your name' };
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield1Data;
    } catch {
      return { fieldName: 'Input Field', fieldData: '', fieldPlaceHolder: data };
    }
  }
  return data;
};

const Update = ({ data, value = '', onChange }: UpdateProps) => {
  const fieldData = resolveData(data);

  return (
    <Input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={fieldData.fieldPlaceHolder}
      className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600"
    />
  );
};
export default Update;
