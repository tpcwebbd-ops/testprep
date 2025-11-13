import ClientSection1 from './all-section/section-1/Client';
import ClientSection2 from './all-section/section-2/Client';
import ClientSection3 from './all-section/section-3/Client';
import ClientSection4 from './all-section/section-4/Client';
import ClientSection5 from './all-section/section-5/Client';
import ClientSection6 from './all-section/section-6/Client';
import { ISectionData as ISectionData1 } from './all-section/section-1/data';
import { ISectionData as ISectionData2 } from './all-section/section-2/data';
import { ISectionData as ISectionData3 } from './all-section/section-3/data';
import { ISectionData as ISectionData4 } from './all-section/section-4/data';
import { ISectionData as ISectionData5 } from './all-section/section-5/data';
import { ISectionData as ISectionData6 } from './all-section/section-6/data';

interface SectionContent {
  sectionUid?: string;
  title?: string;
  image?: string;
  heading?: string;
  description?: string;
  featuredLabel?: string;
  buttonPrimary?: string;
  buttonSecondary?: string;
  studentCount?: string;
  enrollmentText?: string;
  secondaryImage?: string;
  subtitle?: string;
  additionalDescription?: string;
  ctaText?: string;
  highlights?: string[];
}

interface Section {
  id: string;
  title?: string;
  sectionUid?: string;
  serialNumber?: number;
  content?: SectionContent;
  isActive?: boolean;
  picture?: string;
}

const fetchPageData = async (): Promise<Section[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/page-builder/`);

    if (!response.ok) {
      throw new Error('Failed to fetch page data');
    }

    const result = await response.json();

    if (result.data?.sections?.[0]?.content) {
      const sections: Section[] = result.data.sections[0].content;
      return sections.filter(section => section.isActive).sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0));
    }

    return [];
  } catch (error) {
    console.error('Error fetching page data:', error);
    return [];
  }
};

const renderClientSection = (sectionUid: string, content?: SectionContent) => {
  switch (sectionUid) {
    case 'section-uid-1':
      return <ClientSection1 data={content as ISectionData1} />;
    case 'section-uid-2':
      return <ClientSection2 data={content as ISectionData2} />;
    case 'section-uid-3':
      return <ClientSection3 data={content as ISectionData3} />;
    case 'section-uid-4':
      return <ClientSection4 data={content as ISectionData4} />;
    case 'section-uid-5':
      return <ClientSection5 data={content as ISectionData5} />;
    case 'section-uid-6':
      return <ClientSection6 data={content as ISectionData6} />;
    default:
      return null;
  }
};

const Page = async () => {
  const allSections = await fetchPageData();
  return (
    <div className="min-h-screen bg-transparent items-center justify-center w-full pt-4 flex">
      <main className="min-h-screen bg-transparent max-w-7xl flex flex-col gap-6">
        {allSections.length > 0 ? (
          <div className="w-full grid grid-cols-1 gap-6">
            {allSections.map(section => (
              <div key={section.id}>
                <div className="flex flex-col gap-2">{section.sectionUid && renderClientSection(section.sectionUid, section.content)}</div>
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
