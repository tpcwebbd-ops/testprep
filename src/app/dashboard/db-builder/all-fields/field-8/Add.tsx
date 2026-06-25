/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import ImageUploadManagerSingle from '@/components/dashboard-ui/imageBB/ImageUploadManagerSingle';

import { field8Props, Ifield8Data } from './data';

interface AddProps extends field8Props {
  value?: string;
  onChange?: (value: string) => void;
}

type ImageValue = { url: string; name: string };

const fallbackData: Ifield8Data = {
  fieldName: 'Image Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter image URL',
  fieldType: 'IMAGE',
};

const resolveData = (data?: Ifield8Data | string): Ifield8Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield8Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const parseImage = (value: string): ImageValue => {
  if (!value.trim()) return { url: '', name: '' };

  try {
    const parsed = JSON.parse(value);

    if (typeof parsed === 'string') return { url: parsed, name: parsed.split('/').pop() || 'Image' };
    if (parsed && typeof parsed === 'object' && 'url' in parsed && typeof parsed.url === 'string') {
      return { url: parsed.url, name: 'name' in parsed && typeof parsed.name === 'string' ? parsed.name : parsed.url.split('/').pop() || 'Image' };
    }
  } catch {
    return { url: value, name: value.split('/').pop() || 'Image' };
  }

  return { url: '', name: '' };
};

const Add = ({ data, value = '', onChange }: AddProps) => {
  const fieldData = resolveData(data);

  return <ImageUploadManagerSingle value={parseImage(value)} onChange={next => onChange?.(JSON.stringify(next))} label={fieldData.fieldName} />;
};
export default Add;


