/*
|-----------------------------------------
| setting up SocialIcon for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { Facebook, Youtube } from 'lucide-react';

const SocialIcon = () => {
  const socialIconClassName = 'bg-red-500 hover:bg-red-600 p-3 rounded-full transition-colors duration-300 transform hover:scale-110';

  return (
    <>
      <Link
        href="https://www.facebook.com/groups/ielts.sharif.russel"
        target="_blank"
        title="IELTS Sharif Russel Facebook Group"
        className={`${socialIconClassName} flex gap-2 items-center justify-center hover:text-accent`}
      >
        <Facebook className="w-5 h-5" />
      </Link>
      <Link
        href="https://www.facebook.com/TestPrepCenter.BD/"
        target="_blank"
        title="Test Prep Center Facebook Page"
        className={`${socialIconClassName} flex gap-2 items-center justify-center hover:text-accent`}
      >
        <Facebook className="w-5 h-5" />
      </Link>
      <Link
        href="https://www.youtube.com/@TestPrepCenter"
        target="_blank"
        className={`${socialIconClassName} flex gap-2 items-center justify-center hover:text-accent`}
      >
        <Youtube className="w-5 h-5" />
      </Link>
    </>
  );
};
export default SocialIcon;
