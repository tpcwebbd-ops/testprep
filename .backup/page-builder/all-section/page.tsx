/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, November, 2025
|-----------------------------------------
*/
import ClientSection1 from './section-1/Client';
import ClientSection2 from './section-2/Client';
import ClientSection3 from './section-3/Client';
import ClientSection4 from './section-4/Client';
import ClientSection5 from './section-5/Client';
import ClientSection6 from './section-6/Client';

import { defaultData as sectionData1 } from './section-1/data';
import { defaultData as sectionData2 } from './section-2/data';
import { defaultData as sectionData3 } from './section-3/data';
import { defaultData as sectionData4 } from './section-4/data';
import { defaultData as sectionData5 } from './section-5/data';
import { defaultData as sectionData6 } from './section-6/data';
const Page = () => {
  const allSections = [sectionData1, sectionData2, sectionData3, sectionData4, sectionData5, sectionData6];
  const renderClientSection = (title: string) => {
    switch (title) {
      case 'section-uid-1':
        return <ClientSection1 />;
      case 'section-uid-2':
        return <ClientSection2 />;
      case 'section-uid-3':
        return <ClientSection3 />;
      case 'section-uid-4':
        return <ClientSection4 />;
      case 'section-uid-5':
        return <ClientSection5 />;
      case 'section-uid-6':
        return <ClientSection6 />;
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-transparent items-center justify-center w-full pt-4 flex">
      <main className="min-h-screen bg-transparent max-w-7xl flex flex-col gap-6">
        {allSections.length > 0 ? (
          <div className="w-full grid grid-cols-1 gap-6">
            {allSections.map(section => (
              <div key={section.sectionUid}>
                <div className="flex flex-col gap-2">
                  <p className="text-slate-50 font-semibold"># {section.sectionUid}</p>
                  {renderClientSection(section.sectionUid)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/80 text-lg mb-4">No active sections</p>
            <p className="text-white/60">Add and activate sections from the admin panel</p>
          </div>
        )}
      </main>
    </div>
  );
};
export default Page;
