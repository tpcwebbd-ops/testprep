import { defaultData as sectionData1, ISectionData as SectionData1 } from '../../all-section/section-1/data';
import { defaultData as sectionData2, ISectionData as SectionData2 } from '../../all-section/section-2/data';
import { defaultData as sectionData3, ISectionData as SectionData3 } from '../../all-section/section-3/data';
import { defaultData as sectionData4, ISectionData as SectionData4 } from '../../all-section/section-4/data';
import { defaultData as sectionData5, ISectionData as SectionData5 } from '../../all-section/section-5/data';
import { defaultData as sectionData6, ISectionData as SectionData6 } from '../../all-section/section-6/data';

type SectioinDataType = SectionData1 | SectionData2 | SectionData3 | SectionData4 | SectionData5 | SectionData6;

export interface SectionData {
  id: string;
  sectionUid: string;
  title: string;
  content: SectioinDataType;
  isActive: boolean;
  picture: string;
}

export const initialSectionData: SectionData[] = [
  {
    id: sectionData1.sectionUid,
    title: sectionData1.title,
    sectionUid: sectionData1.sectionUid,
    content: sectionData1,
    isActive: true,
    picture: '/all-section/section-1.png',
  },
  {
    id: sectionData2.sectionUid,
    title: sectionData2.title,
    sectionUid: sectionData2.sectionUid,
    content: sectionData2,
    isActive: false,
    picture: '/all-section/section-2.png',
  },
  {
    id: sectionData3.sectionUid,
    title: sectionData3.title,
    sectionUid: sectionData3.sectionUid,
    content: sectionData3,
    isActive: false,
    picture: '/all-section/section-3.png',
  },
  {
    id: sectionData4.sectionUid,
    title: sectionData4.title,
    sectionUid: sectionData4.sectionUid,
    content: sectionData4,
    isActive: false,
    picture: '/all-section/section-4.png',
  },
  {
    id: sectionData5.sectionUid,
    title: sectionData5.title,
    sectionUid: sectionData5.sectionUid,
    content: sectionData5,
    isActive: false,
    picture: '/all-section/section-5.png',
  },
  {
    id: sectionData6.sectionUid,
    title: sectionData6.title,
    sectionUid: sectionData6.sectionUid,
    content: sectionData6,
    isActive: false,
    picture: '/all-section/section-6.png',
  },
];
