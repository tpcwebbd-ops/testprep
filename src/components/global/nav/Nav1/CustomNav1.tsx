/*
|-----------------------------------------
| setting up CustomNav1 for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

import Link from 'next/link';
import { FaFacebook, FaYoutube } from 'react-icons/fa';

const CustomNav1 = () => {
  return (
    <nav className="w-full flex gap-4 items-center justify-end text-center px-4 bg-slate-700 text-slate-50">
      <div className="mx-auto container flex items-center justify-end gap-4 px-4">
        <a href="tel:+8801786558855">+880 1786 558855</a>
        <Link href="https://www.facebook.com/groups/ielts.sharif.russel" target="_blank" className="flex gap-2 items-center justify-center hover:text-accent">
          <FaFacebook /> Group
        </Link>
        <Link href="https://www.facebook.com/TestPrepCenter.BD/" target="_blank" className="flex gap-2 items-center justify-center hover:text-accent">
          <FaFacebook /> Page
        </Link>
        <Link href="https://www.youtube.com/@TestPrepCenter" target="_blank" className="flex gap-2 items-center justify-center hover:text-accent">
          <FaYoutube /> Channel
        </Link>
      </div>
    </nav>
  );
};
export default CustomNav1;
