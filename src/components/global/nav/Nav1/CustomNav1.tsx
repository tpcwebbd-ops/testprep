/*
|-----------------------------------------
| setting up CustomNav1 for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

import Link from 'next/link';
import { FaFacebook } from 'react-icons/fa';

const CustomNav1 = () => {
  type links = {
    name: string;
    url: string;
  }[];
  const links: links = [{ name: '+8801786 558855', url: '/' }];

  return (
    <nav className="w-full flex gap-4 items-center justify-end text-center px-4 bg-slate-700 text-slate-50">
      <div className="mx-auto container flex items-center justify-end gap-4">
        <div>+880 1786 558855</div>
        <Link href="https://www.facebook.com/groups/ielts.sharif.russel" target="_blank" className="flex gap-2 items-center justify-center hover:text-accent">
          <FaFacebook /> Group
        </Link>
        <Link href="https://www.facebook.com/TestPrepCenter.BD/" target="_blank" className="flex gap-2 items-center justify-center hover:text-accent">
          <FaFacebook /> Pgee
        </Link>
      </div>
    </nav>
  );
};
export default CustomNav1;
