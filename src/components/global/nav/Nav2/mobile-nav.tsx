/*
|-----------------------------------------
| setting up MobileNav for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ShadCNNavMobile } from "./shadcn-nav-mobile";
import NavLogo from "./nav-logo";
import OtherLink from "./other-link";

const MobileNav = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <div className="inline-block md:hidden w-full">
      <nav className="w-full flex-col flex items-center py-4 sticky top-0 left-0 z-40 px-4">
        <div className="w-full flex items-center justify-between">
          <NavLogo />
          {toggle ? (
            <span
              onClick={() => setToggle(false)}
              className="font-bold cursor-pointer"
            >
              <X />
            </span>
          ) : (
            <span
              onClick={() => setToggle(true)}
              className="font-bold cursor-pointer"
            >
              <Menu />
            </span>
          )}
        </div>
        {toggle && (
          <ScrollArea className="h-[80vh] w-full pr-6">
            <div className=" flex items-start gap-8 mt-8 w-full flex-col">
              <ShadCNNavMobile />
              <OtherLink />
            </div>
          </ScrollArea>
        )}
      </nav>
    </div>
  );
};
export default MobileNav;
