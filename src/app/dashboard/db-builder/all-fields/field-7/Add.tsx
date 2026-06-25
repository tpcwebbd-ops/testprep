/*
|-----------------------------------------
| setting up Add for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import ImageUploadManager from '@/components/dashboard-ui/imageBB/ImageUploadManager';

import { field7Props, Ifield7Data } from './data';

interface AddProps extends field7Props {
  value?: string;
  onChange?: (value: string) => void;
}

type ImageValue = { url: string; name: string };

const fallbackData: Ifield7Data = {
  fieldName: 'Images Field',
  fieldData: '',
  fieldPlaceHolder: 'Enter image URLs separated by comma',
  fieldType: 'IMAGES',
};

const resolveData = (data?: Ifield7Data | string): Ifield7Data => {
  if (!data) return fallbackData;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as Ifield7Data;
    } catch {
      return { ...fallbackData, fieldPlaceHolder: data };
    }
  }
  return data;
};

const parseImages = (value: string): ImageValue[] => {
  if (!value.trim()) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(item => {
        if (typeof item === 'string') return { url: item, name: item.split('/').pop() || 'Image' };
        if (item && typeof item === 'object' && 'url' in item && typeof item.url === 'string') {
          return { url: item.url, name: 'name' in item && typeof item.name === 'string' ? item.name : item.url.split('/').pop() || 'Image' };
        }
        return null;
      })
      .filter((item): item is ImageValue => Boolean(item));
  } catch {
    return value
      .split(',')
      .map(url => url.trim())
      .filter(Boolean)
      .map(url => ({ url, name: url.split('/').pop() || 'Image' }));
  }
};

const Add = ({ data, value = '', onChange }: AddProps) => {
  const fieldData = resolveData(data);

  return <ImageUploadManager value={parseImages(value)} onChange={next => onChange?.(JSON.stringify(next))} label={fieldData.fieldName} />;
};
export default Add;


