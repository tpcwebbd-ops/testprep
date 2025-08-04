/*
|-----------------------------------------
| setting up ShadcnNavTablet for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import navData from './nav-data';
import NavImage from './nav-image';

const { services, about } = navData || {};
const { fullName, description, links, groupTitle } = about || {};

export function ShadCNNavTablet() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent border-0">{groupTitle}</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-transparent backdrop-blue">
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-between rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/about"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <NavImage black={true} width={300} height={300} className="w-[300px]" />
                    </div>
                    <div className="pb-2">
                      <div className="mb-2 mt-4 text-lg font-medium">{fullName}</div>
                      <p className="text-sm leading-tight text-muted-foreground">{description}</p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
              {links.map(curr => (
                <ListItem key={curr.id} href={curr.url} title={curr.title}>
                  {curr.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent border-0">{services.groupTitle}</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-transparent backdrop-blue">
            <ul className="grid w-[300px] gap-3 p-4 md:w-[300px] md:grid-cols-2 lg:w-[600px] ">
              {services.data.map(component => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
