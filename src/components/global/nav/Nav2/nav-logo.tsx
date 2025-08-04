/*
|-----------------------------------------
| setting up NavLogo for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/
import Link from "next/link";
import navData from "./nav-data";
import NavImage from "./nav-image";

const { baseInfo } = navData || {};

const NavLogo = () => {
  return (
    <Link href="/" className="flex gap-1 items-center justify-start text-2xl">
      <span className="text-[#ff4904] font-extrabold">
        <span className="flex items-center justify-center gap-1">
          <div className="w-full h-full flex items-center justify-center">
            <NavImage />
          </div>
          {baseInfo.firstName}
        </span>
      </span>
      {baseInfo.lastName}
    </Link>
  );
};
export default NavLogo;
