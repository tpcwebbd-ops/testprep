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
  return <span className="text-sm text-white">{value || 'N/A'}</span>;
};
export default View;


