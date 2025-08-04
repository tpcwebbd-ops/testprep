/*
|-----------------------------------------
| setting up sidebar hover items for the app
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { LINKTYPE } from './sidebar-data';
import { SIDEBARTYPE } from './sidebar-data';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const SidebarHoverItem = ({ data }: { children?: ReactNode | null; data?: ReactNode | null | SIDEBARTYPE; className?: string | null }) => {
  const { name, icon, isActive = false, content, link = '/' } = data as SIDEBARTYPE;

  const cardContent = (
    <>
      <div className={`${content.length > 0 && 'border-b'} min-py-2`}>
        {link !== '' ? (
          <Link href={`${link}`}>
            <h2 className="w-full py-2 pl-4">{name}</h2>
          </Link>
        ) : (
          <h2 className="w-full py-2 pl-4">{name}</h2>
        )}
      </div>
      <div className="relative -right-6 top-0 z-50 w-full max-w-[230px]">
        {/* <div className="animated-div fixed left-[36px] top-[-30px] h-4 w-4 rotate-45 animate-none border-b border-transparent border-l bg-none" /> */}
        <div className="right-0 -ml-6 flex flex-col overflow-hidden">
          {content?.map((curr: LINKTYPE, index: number) => {
            return (
              <Link
                key={curr.id || index}
                href={`${curr.link}`}
                className="flex items-center justify-start gap-2 rounded py-[.35rem] pl-[35px] hover:bg-[#eff2f6] hover:text-[#3874ff]"
              >
                <span className="flex items-center gap-2">
                  {curr.icon} {curr.name}{' '}
                </span>
                {curr.badge && (
                  <Badge variant="outline" className="rounded-[.25rem] border border-[#96d9ff] bg-[#c7ebff] py-0 text-[.60rem] text-[#005585]">
                    {curr.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className=" flex min-h-[22px] w-full cursor-pointer items-center justify-center rounded-[.5rem] py-2 hover:bg-[#eff2f6]">
          <div className="relative py-1">
            {icon}
            {isActive && <div className="absolute right-[-3px] top-[-3px] h-[6px] w-[6px] rounded-full bg-[#3874ff]"></div>}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className=" -top-[45px] left-[30px] block animate-none rounded-lg p-0 py-2 text-[.8rem] md:absolute">{cardContent}</HoverCardContent>
    </HoverCard>
  );
};
export default SidebarHoverItem;
SidebarHoverItem.defaultProps = { children: '', data: '', className: '' };
