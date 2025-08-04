/*
|-----------------------------------------
| setting up sidebar for the app
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/
import SidebarAccordion from './sidebar-accordion';
import {
  sidebarDataHome,
  sidebarDataECommerce,
  sidebarDataCRM,
  sidebarDataProjectManagement,
  sidebarDataProjectChat,
  sidebarDataProjectEmail,
  sidebarDataProjectEvents,
  sidebarDataProjectKanban,
  sidebarDataProjectSocial,
  sidebarDataProjectCalendar,
  sidebarDataProjectStarter,
  sidebarDataProjectFaq,
  sidebarDataProjectLoading,
} from './sidebar-data';

import { CgArrowLongLeft, CgArrowLongRight } from 'react-icons/cg';
import SidebarHoverItem from './sidebar-hover-item';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar = ({ toggle, handleToggle, toggleButton = false }: { toggleButton?: boolean; toggle: boolean; handleToggle: () => void }) => {
  return (
    <div className="h-screen relative">
      <div className="relative text-slate-600">
        <ScrollArea className="h-[calc(100vh_-_122px)]">
          {toggle ? (
            <div className="ml-3">
              <SidebarAccordion data={sidebarDataHome} className="pt-4" />
              <h2 className="mb-2 mt-4 pl-4 text-[.8rem]">APPS</h2>
              <SidebarAccordion data={sidebarDataECommerce} />
              <SidebarAccordion data={sidebarDataCRM} />
              <SidebarAccordion data={sidebarDataProjectManagement} />
              <SidebarAccordion data={sidebarDataProjectChat} />
              <SidebarAccordion data={sidebarDataProjectEmail} />
              <SidebarAccordion data={sidebarDataProjectEvents} />
              <SidebarAccordion data={sidebarDataProjectKanban} />
              <SidebarAccordion data={sidebarDataProjectSocial} />
              <SidebarAccordion data={sidebarDataProjectCalendar} />

              <h2 className="mb-2 mt-4 pl-4 text-[.8rem]">PAGES</h2>
              <SidebarAccordion data={sidebarDataProjectStarter} />
              <SidebarAccordion data={sidebarDataProjectFaq} />
              <SidebarAccordion data={sidebarDataProjectLoading} />
            </div>
          ) : (
            <div className="flex flex-col p-2">
              <div className="h-4" />
              <SidebarHoverItem data={sidebarDataHome} />
              <div className="my-4 flex w-full justify-center border-t" />
              <SidebarHoverItem data={sidebarDataECommerce} />
              <SidebarHoverItem data={sidebarDataCRM} />
              <SidebarHoverItem data={sidebarDataProjectManagement} />
              <SidebarHoverItem data={sidebarDataProjectChat} />
              <SidebarHoverItem data={sidebarDataProjectEmail} />
              <SidebarHoverItem data={sidebarDataProjectEvents} />
              <SidebarHoverItem data={sidebarDataProjectKanban} />
              <SidebarHoverItem data={sidebarDataProjectSocial} />
              <SidebarHoverItem data={sidebarDataProjectCalendar} />
              <SidebarHoverItem data={sidebarDataProjectStarter} />
              <SidebarHoverItem data={sidebarDataProjectFaq} />
              <SidebarHoverItem data={sidebarDataProjectLoading} />
              <div className="h-16" />
            </div>
          )}
        </ScrollArea>

        {!toggleButton && (
          <>
            {toggle ? (
              <div onClick={handleToggle} className="bottom-[-60px] left-0 block w-[253px] md:absolute">
                <h3 className="flex w-full cursor-pointer items-center justify-start gap-4 border-t border-slate-200 bg-slate-50 py-4 text-[.8rem]">
                  <span className="ml-4">
                    <CgArrowLongLeft />
                  </span>
                  Collapsed View
                </h3>
              </div>
            ) : (
              <div onClick={handleToggle} className="bottom-[-60px] left-0 block w-[63px] md:absolute">
                <h3 className="flex w-full cursor-pointer items-center justify-center border-t border-slate-200 bg-slate-50 pb-[17px] pt-[18px]">
                  <span className="">
                    <CgArrowLongRight />
                  </span>
                </h3>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
