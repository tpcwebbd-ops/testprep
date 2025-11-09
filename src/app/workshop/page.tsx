// Page.tsx

'use client';

import { useSectionStore } from './admin/store/section-store';
import ClientSection1 from './section/all-section/section-1/Client';
import ClientSection2 from './section/all-section/section-2/Client';
import ClientSection3 from './section/all-section/section-3/Client';
import ClientSection4 from './section/all-section/section-4/Client';
import ClientSection5 from './section/all-section/section-5/Client';
import ClientSection6 from './section/all-section/section-6/Client';

const Page = () => {
  const { sectionList } = useSectionStore();

  const activeSections = sectionList.filter(section => section.isActive);

  const renderClientSection = (title: string) => {
    switch (title) {
      case 'Section 1':
        return <ClientSection1 />;
      case 'Section 2':
        return <ClientSection2 />;
      case 'Section 3':
        return <ClientSection3 />;
      case 'Section 4':
        return <ClientSection4 />;
      case 'Section 5':
        return <ClientSection5 />;
      case 'Section 6':
        return <ClientSection6 />;
      default:
        return null;
    }
  };
  console.log('activeSections', activeSections);
  return (
    <main className="min-h-screen bg-transparent">
      {activeSections.length > 0 ? (
        <div className="w-full grid grid-cols-1 gap-6">
          {activeSections.map(section => (
            <div key={section.id}>{renderClientSection(section.title)}</div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-white/80 text-lg mb-4">No active sections</p>
          <p className="text-white/60">Add and activate sections from the admin panel</p>
        </div>
      )}
    </main>
  );
};

export default Page;
