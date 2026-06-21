/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { field4Props } from './data';

interface ViewProps extends field4Props {
  value?: string;
}

const View = ({ value = '' }: ViewProps) => {
  return <div className="min-h-10 whitespace-pre-wrap rounded-md bg-slate-950 px-3 py-2 text-slate-200">{value || '-'}</div>;
};
export default View;
