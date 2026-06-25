/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import Image from 'next/image';

import { field8Props } from './data';

interface ViewProps extends field8Props {
  value?: string;
}

type ImageValue = { url: string; name: string };

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

const View = ({ value = '' }: ViewProps) => {
  const image = parseImage(value);

  return (
    <div className="mt-6">
      {image.url ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/20 bg-white/10 backdrop-blur-lg">
          <Image src={image.url} fill className="object-cover" alt={image.name || 'Personal Image'} />
        </div>
      ) : (
        <p className="text-white/70 text-sm">No image.</p>
      )}
    </div>
  );
};
export default View;


