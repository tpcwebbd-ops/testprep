/*
|-----------------------------------------
| setting up CustomNav2 for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

import TabletNav from './tablet-nav';
import MobileNav from './mobile-nav';

const Nav = () => {
  return (
    <div className="w-full bg-opacity-60 md:bg-opacity-40 backdrop-blur">
      <div className="mx-auto max-w-7xl flex flex-col">
        <TabletNav />
        <MobileNav />
      </div>
    </div>
  );
};
export default Nav;
