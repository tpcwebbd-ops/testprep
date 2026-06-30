/*
|-----------------------------------------
| setting up View for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, June, 2026
|-----------------------------------------
*/

import { field20Props } from './data';

interface ViewProps extends field20Props {
  value?: string;
}

const hasRichTextValue = (value: string) => {
  const text = value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
  return text.length > 0;
};

const View = ({ value = '' }: ViewProps) => {
  if (!hasRichTextValue(value)) {
    return <span className="text-sm text-white">N/A</span>;
  }

  return (
    <div
      className="prose prose-invert prose-sm max-w-none text-sm text-white [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};
export default View;


