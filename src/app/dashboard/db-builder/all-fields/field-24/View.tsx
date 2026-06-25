/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { field24Props } from './data';

interface ViewProps extends field24Props {
  value?: string;
}

const parseMultiValue = (value: string): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
};

const View = ({ value = '' }: ViewProps) => {
  const values = parseMultiValue(value);
  return <span className="text-sm text-white">{values.length ? values.join(', ') : 'N/A'}</span>;
};
export default View;


