/*
|-----------------------------------------
| setting up Update for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { Input } from '@/components/ui/input';

import { field2Props, Ifield2Data } from './data';

interface UpdateProps extends field2Props {
  value?: string;
  onChange?: (value: string) => void;
}

const resolveData = (data?: Ifield2Data | string): Ifield2Data => {
  if (!data) return { fieldName: 'Input Field', fieldData: '', fieldPlaceHolder: 'Enter your email' };
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield2Data;
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
      type="email"
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={fieldData.fieldPlaceHolder}
      className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600"
    />
  );
};
export default Update;
