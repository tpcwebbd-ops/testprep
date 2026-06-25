/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { format } from 'date-fns';

import { field15Props } from './data';

interface ViewProps extends field15Props {
  value?: string;
}

const View = ({ value = '' }: ViewProps) => {
  const formatValue = (date?: string | Date) => {
    if (!date) return 'N/A';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return 'Invalid';
    return format(parsed, 'MMM dd, yyyy');
  };

  try {
    const parsed = value ? JSON.parse(value) : {};
    return <span className="text-sm text-white">{`${formatValue(parsed.from)} - ${formatValue(parsed.to)}`}</span>;
  } catch {
    return <span className="text-sm text-white">N/A</span>;
  }
};
export default View;


