/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { field27Props } from './data';

interface ViewProps extends field27Props {
  value?: string;
}

const formatJsonValue = (value: string) => {
  if (!value) return '';
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
};

const View = ({ value = '' }: ViewProps) => {
  return <pre className="mt-1 overflow-auto rounded-md bg-white/5 p-2 text-[11px] text-white/90">{value ? formatJsonValue(value) : 'N/A'}</pre>;
};
export default View;


