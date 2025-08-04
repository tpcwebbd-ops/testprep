/*
|-----------------------------------------
| setting up CustomNav1 for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

import CustomLink from '../CustomLink';

const CustomNav1 = () => {
  type links = {
    name: string;
    url: string;
  }[];
  const links: links = [
    { name: 'Home', url: '/' },
    { name: '+8801786 558855', url: '/' },
  ];

  return (
    <nav className="w-full flex gap-4 items-center justify-end text-center px-4 bg-slate-700 text-slate-400">
      {links.map((i, idx) => (
        <CustomLink i={i} key={i.name + idx} />
      ))}
    </nav>
  );
};
export default CustomNav1;
