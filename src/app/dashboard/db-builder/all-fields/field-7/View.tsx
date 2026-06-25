/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import Image from 'next/image';

import { field7Props } from './data';

interface ViewProps extends field7Props {
  value?: string;
}

type ImageValue = { url: string; name: string };

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

const View = ({ value = '' }: ViewProps) => {
  const images = parseImages(value);

  return (
    <div className="mt-6">
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {images.map((val, index) => (
            <div key={`${val.url}-${index}`} className="relative h-32 rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
              <Image src={val.url} fill className="object-cover" alt={val.name || `Products Images ${index + 1}`} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/70 text-sm">No images.</p>
      )}
    </div>
  );
};
export default View;


