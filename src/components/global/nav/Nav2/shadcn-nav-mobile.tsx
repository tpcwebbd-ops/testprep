/*
|-----------------------------------------
| setting up TabletNav for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

"use client";

import * as React from "react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import navData from "./nav-data";

const { services, about } = navData || {};

const { fullName, description, links, groupTitle } = about || {};
export function ShadCNNavMobile() {
  return (
    <div className="flex w-full flex-col">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:no-underline">
            {groupTitle}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <div className="h-full w-auto">
                  <Link
                    className="flex h-full w-full select-none flex-col justify-between rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/about"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src="/next.svg"
                        alt="Logo for the website"
                        width={100}
                        height={100}
                        className="w-auto h-auto"
                      />
                    </div>
                    <div className="pb-2">
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {fullName}
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </Link>
                </div>
              </li>
              {links.map((curr) => (
                <Link
                  key={curr.id}
                  href={curr.url}
                  className="flex gap-1 flex-col"
                >
                  <h2 className="text-xl font-bold text-slate-800">
                    {curr.title}
                  </h2>
                  {curr.description}
                </Link>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="hover:no-underline">
            {services.groupTitle}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="grid w-full grid-cols-1 gap-3 p-4  ">
              {services.data.map((component) => (
                <Link
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  <div className="text-sm font-medium leading-none">
                    {component.title}
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {component.description}
                  </p>
                </Link>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
