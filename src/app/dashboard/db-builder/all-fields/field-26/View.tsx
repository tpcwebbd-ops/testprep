/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { field26Props } from './data';
import { parseStudentsValue } from './students-utils';

interface ViewProps extends field26Props {
  value?: string;
}

const View = ({ value = '' }: ViewProps) => {
  const students = parseStudentsValue(value);

  return <pre className="mt-1 overflow-auto rounded-md bg-white/5 p-2 text-[11px] text-white/90">{students.length ? JSON.stringify(students, null, 2) : 'N/A'}</pre>;
};
export default View;


