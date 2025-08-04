/*
|-----------------------------------------
| setting up sidebarV3SidebarV3 for the app
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/
'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { GoTriangleDown } from 'react-icons/go';
import { Badge } from '@/components/ui/badge';
import { LINKTYPE, SIDEBARTYPE } from './sidebar-data';

const SidebarAccordion = ({ data, className }: { children?: ReactNode | null; data?: ReactNode | null | SIDEBARTYPE; className?: string | null }) => {
  const [toggle, setToggle] = useState(false);
  const { name, icon, isActive = false, content, link = '' } = data as SIDEBARTYPE;

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className={`max-w-[220px] border-b-0 ${className}`}>
        <AccordionTrigger
          onClick={handleToggle}
          className="w-[248px] rounded-[.5rem] py-[.35rem] hover:bg-[#eff2f6] hover:no-underline pr-2 transition-colors duration-200"
        >
          <div className="w-full">
            <div className="flex items-center justify-start gap-2 pl-4 text-[.8rem]">
              <span className="flex items-center">
                <span
                  className={`transform transition-transform duration-300 ease-in-out ${toggle ? 'rotate-0' : '-rotate-90'} ${
                    content.length > 0 ? 'visible' : 'invisible'
                  }`}
                >
                  <GoTriangleDown />
                </span>
                {icon && <span className="transition-colors duration-200">{icon}</span>}
              </span>
              <div className="relative">
                {link !== '' ? (
                  <Link href={`${link}`}>
                    <h2 className="w-full transition-colors duration-200">{name}</h2>
                  </Link>
                ) : (
                  <h2 className="w-full transition-colors duration-200">{name}</h2>
                )}
                {isActive && <div className="absolute right-[-10px] top-[2px] h-[6px] w-[6px] rounded-full bg-[#3874ff] animate-pulse" />}
              </div>
            </div>
          </div>
        </AccordionTrigger>
        {content.length > 0 && (
          <AccordionContent className="transition-all duration-300 ease-in-out">
            <div className={`flex w-full max-w-[248px] flex-col ${className}`}>
              {content?.map((curr: LINKTYPE, index: number) => {
                return (
                  <Link
                    key={curr.id || index}
                    href={`${curr.link}`}
                    className="flex items-center justify-start gap-2 rounded py-[.35rem] pl-[45px] hover:bg-[#eff2f6] hover:text-[#3874ff] transition-all duration-200"
                  >
                    <span className="flex items-center gap-2 transition-colors duration-200">
                      {curr.icon} {curr.name}
                    </span>
                    {curr.badge && (
                      <Badge
                        variant="outline"
                        className="rounded-[.25rem] border border-[#96d9ff] bg-[#c7ebff] py-0 text-[.60rem] text-[#005585] transition-all duration-200"
                      >
                        {curr.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default SidebarAccordion;

SidebarAccordion.defaultProps = {
  children: '',
  data: '',
  className: '',
};
