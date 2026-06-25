/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { field5Props } from './data';

interface ViewProps extends field5Props {
  value?: string;
}

const View = ({ value = '' }: ViewProps) => {
  return <div className="min-h-10 whitespace-pre-wrap rounded-sm bg-white/10 backdrop-blur-md px-3 py-2 text-white">{value || '-'}</div>;
};
export default View;


