/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import Link from 'next/link';

const HomeButton = () => {
  return (
    <Link href="/dashboard/a__1_1001_users__/all" className="w-full hover:bg-slate-400 bg-slate-300 p-1 border-1 border-slate-400 ">
      Back to Home
    </Link>
  );
};
export default HomeButton;
