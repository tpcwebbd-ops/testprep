/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { field17Props } from './data';

interface ViewProps extends field17Props {
  value?: string;
}

const View = ({ value = '' }: ViewProps) => {
  return (
    <div className="flex items-center gap-2">
      <span>{value || 'N/A'}</span>
      {value && <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: value }} />}
    </div>
  );
};
export default View;


