/*
|-----------------------------------------
| setting up sidebarV3SidebarV3 for the app
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

import { CgArrowLongLeft, CgArrowLongRight } from 'react-icons/cg';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sidebarDataHome } from './sidebar-data';
import SidebarAccordion from './sidebar-accordion';
import SidebarHoverItem from './sidebar-hover-item';

const SidebarV3 = ({ toggle, handleToggle, toggleButton = false }: { toggleButton?: boolean; toggle: boolean; handleToggle: () => void }) => {
  return (
    <div className=" border-slate-500 md:border-b md:pb-[60px] ">
      <div className="relative text-slate-600">
        {!toggleButton && (
          <>
            {toggle ? (
              <div onClick={handleToggle} className="top-0 left-0 block w-[253px] md:absolute ">
                <h3 className="flex w-full cursor-pointer items-center justify-start gap-4 md:border-t border-slate-200 bg-slate-50 py-4 text-[.8rem]">
                  <span className="ml-4">
                    <CgArrowLongLeft />
                  </span>
                  Hide
                </h3>
              </div>
            ) : (
              <div onClick={handleToggle} className="top-0 left-0 block w-[63px] md:absolute ">
                <h3 className="flex w-full cursor-pointer items-center justify-center md:border-t border-slate-200 bg-slate-50 pb-[17px] pt-[18px]">
                  <span title="View">
                    <CgArrowLongRight />
                  </span>
                </h3>
              </div>
            )}
          </>
        )}
        <ScrollArea className="md:h-[calc(100vh_-_122px)] md:top-[50px] md:border-t-1 pt-2">
          {toggle ? (
            <div className="ml-3">
              {sidebarDataHome.map((curr, idx) => (
                <SidebarAccordion data={curr} key={curr.name + idx} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col p-2">
              <div className="h-4" />
              {sidebarDataHome.map((curr, idx) => (
                <SidebarHoverItem data={curr} key={curr.name + idx} />
              ))}
              <div className="h-16" />
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
export default SidebarV3;
