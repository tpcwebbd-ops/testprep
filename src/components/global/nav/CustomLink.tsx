/*
|-----------------------------------------
| setting up CustomLink for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CustomLink = ({ i }: { i: { name: string; url: string } }) => {
  const pathname = usePathname();
  const currPath = pathname.split('/')[1];
  const iPath = i.url.split('/')[1];

  const pathStyle = currPath === iPath ? ' text-white ' : ' text-slate-400 ';
  return (
    <Link key={i.name} className={` my-2 hover:underline cursor-pointer ${pathStyle}`} href={i.url}>
      {i.name}
    </Link>
  );
};
export default CustomLink;
