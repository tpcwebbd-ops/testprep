/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { field16Props } from './data';

interface ViewProps extends field16Props {
  value?: string;
}

const View = ({ value = '' }: ViewProps) => {
  try {
    const parsed = value ? JSON.parse(value) : {};
    return <span className="text-sm text-white">{`${parsed.start || 'N/A'} - ${parsed.end || 'N/A'}`}</span>;
  } catch {
    return <span className="text-sm text-white">N/A - N/A</span>;
  }
};
export default View;


