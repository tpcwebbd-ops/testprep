/*
|-----------------------------------------
| setting up sidebarV3SidebarV3 for the app
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

import { CgArrowLongLeft, CgArrowLongRight } from 'react-icons/cg';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sidebarDataHome, SIDEBARTYPE } from './sidebar-data';
import SidebarAccordion from './sidebar-accordion';
import SidebarHoverItem from './sidebar-hover-item';
import { useGetUsers_accessQuery } from '@/app/dashboard/access-management/all/redux/rtk-Api';
import { useSession } from 'next-auth/react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { accessDataByUsers } from '@/app/dashboard/access-management/users-access-role';

const isAccessByRole = (curr: SIDEBARTYPE, currRole: string) => {
  let result = false;
  accessDataByUsers.forEach(item => {
    if (currRole === item.role) {
      if (item.accessSidebarName.map(c => c.toLowerCase()).includes(curr.name.toLowerCase())) {
        result = true;
      } else {
        result = false;
      }
    }
  });

  return result;
};

const SidebarV3 = ({ toggle, handleToggle, toggleButton = false }: { toggleButton?: boolean; toggle: boolean; handleToggle: () => void }) => {
  const sessionData = useSession();

  const { data: getResponseData } = useGetUsers_accessQuery(
    { q: sessionData.data?.user?.email, page: 1, limit: 1 },
    {
      selectFromResult: ({ data, isSuccess, status, error, isLoading }) => ({
        data,
        isSuccess,
        status: 'status' in (error || {}) ? (error as FetchBaseQueryError).status : status, // Extract HTTP status code
        error,
        isLoading,
      }),
    },
  );

  const currRole = getResponseData?.data?.users_access[0]?.role || '';

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
              {sidebarDataHome
                .filter(item => isAccessByRole(item, currRole))
                .map((curr, idx) => (
                  <SidebarAccordion data={curr} key={curr.name + idx} />
                ))}
            </div>
          ) : (
            <div className="flex flex-col p-2">
              <div className="h-4" />
              {sidebarDataHome
                .filter(item => isAccessByRole(item, currRole))
                .map((curr, idx) => (
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
