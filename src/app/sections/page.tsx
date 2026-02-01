/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: webapp, August, 2025
|-----------------------------------------
*/
'use client';

import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import { useState } from 'react';

export default function Home() {
  const [value, setValue] = useState<string>('');
  const [valueM, setValueM] = useState<string[]>([]);
  const onChangeImage = (url: string) => {
    setValue(url);
  };
  const onChangeImageM = (newValues: string[]) => {
    setValueM(newValues);
  };
  return (
    <>
      <div className="mt-[65px] " />
      <div className="w-full py-12 bg-blue-300 text-slate-800 p-12">
        <p>State: {value}</p>
        <ImageUploadManager onChange={onChangeImageM} value={valueM} />
        <div className="hr"></div>
        <ImageUploadManagerSingle onChange={onChangeImage} value={value} />
      </div>
    </>
  );
}
/*
Document :  
2. ImageUploadManager -> multiple image upload manageer.
3. ImageUploadManagerSingle -> single image upload manager.

*/
