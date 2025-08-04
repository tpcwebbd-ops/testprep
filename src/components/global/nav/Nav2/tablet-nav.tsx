/*
|-----------------------------------------
| setting up TabletNav for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/
import { ShadCNNavTablet } from './shadcn-nav-tablet';
import NavLogo from './nav-logo';
import OtherLink from './other-link';

const TabletNav = () => {
  return (
    <div className="hidden md:inline-block">
      <nav className="w-full flex items-center justify-between py-4">
        <NavLogo />
        <div className=" flex items-center gap-8">
          <ShadCNNavTablet />
          <OtherLink />
        </div>
      </nav>
    </div>
  );
};
export default TabletNav;
