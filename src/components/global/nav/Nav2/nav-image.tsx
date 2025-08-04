/*
|-----------------------------------------
| setting up NavImage for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

import Image from 'next/image';

const NavImage = ({ black = false, width = 40, height = 40, className = '' }: { className?: string; width?: number; height?: number; black?: boolean }) => {
  return (
    <Image
      src={black ? 'logo-black.svg' : '/logo-black.svg'}
      alt="Logo for the website"
      width={width}
      height={height}
      className={`mt-[-3px] h-auto ${className}`}
    />
  );
};
export default NavImage;
