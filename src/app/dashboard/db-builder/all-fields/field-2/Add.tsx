/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { Input } from '@/components/ui/input';

import { field2Props, Ifield2Data } from './data';

interface AddProps extends field2Props {
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

const Add = ({ data, value = '', onChange }: AddProps) => {
  const fieldData = resolveData(data);

  return (
    <Input
      type="email"
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={fieldData.fieldPlaceHolder}
      className="bg-white/10 backdrop-blur-md border-white/10 text-white placeholder:text-white/40"
    />
  );
};
export default Add;


