/*
|-----------------------------------------
| setting up SiteNavLayoutClickV1 for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

'use client';

import { useState } from 'react';

import Sidebar from './sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IoSettingsOutline } from 'react-icons/io5';
import { X } from 'lucide-react';

const SiteNavLayoutClickV1 = () => {
  const [toggle, setToggle] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(false);
  const handleToggle = () => setToggle(pre => !pre);
  const handleMobileToggle = () => setMobileToggle(pre => !pre);
  return (
    <main className="w-full min-h-screen">
      <div className={`grid grid-cols-1 ${toggle ? 'md:grid-cols-[253px_1fr]' : 'md:grid-cols-[63px_1fr]'}`}>
        <ScrollArea className={`w-full block md:hidden ${mobileToggle ? 'h-[60px]' : 'h-screen'}`}>
          <div className="block md:hidden">
            <div className="p-4 absolute w-full right-0">
              {mobileToggle ? (
                <div onClick={handleMobileToggle} className="w-full flex items-end justify-between">
                  <p>Sidebar</p>
                  <IoSettingsOutline className="w-[20px] h-[20px]" />
                </div>
              ) : (
                <div className="min-h-screen w-full flex flex-col">
                  <div onClick={handleMobileToggle} className="w-full flex items-end justify-between">
                    <p>Sidebar</p>
                    <X />
                  </div>
                  <Sidebar toggle={true} handleToggle={handleToggle} toggleButton />
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <Sidebar toggle={toggle} handleToggle={handleToggle} />
          </div>
        </ScrollArea>
        <ScrollArea className={`w-full h-screen hidden md:block`}>
          <div className="hidden md:block">
            <Sidebar toggle={toggle} handleToggle={handleToggle} />
          </div>
        </ScrollArea>

        <div className="h-[calc(100vh_-_62px)] w-full border-l border-slate-200">
          <ScrollArea className="h-[calc(100vh_-_62px)] ">
            <ScrollArea>
              <div className="text-4xl w-full h-screen flex items-center justify-center">Children side nav layout</div>
            </ScrollArea>
          </ScrollArea>
        </div>
      </div>
    </main>
  );
};
export default SiteNavLayoutClickV1;
