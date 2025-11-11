export interface ISectionData {
  id: string;
  sectionUid: string;
  title: string;
  image: string;
  heading: string;
  description: string;
  featuredLabel: string;
  buttonPrimary: string;
  buttonSecondary: string;
  studentCount: string;
  enrollmentText: string;
}

export interface Section1Props {
  data?: ISectionData;
}

export const defaultData: ISectionData = {
  sectionUid: 'section-uid-1',
  id: 'adsfdsfdfdsaa',
  title: 'Most common Component',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'Lecture 45',
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio reprehenderit aliquid harum quae deserunt repudiandae assumenda, atque eos a ad placeat vel vitae.',
  featuredLabel: 'Featured Content',
  buttonPrimary: 'Learn More',
  buttonSecondary: 'View Details',
  studentCount: '2.5k+ Students',
  enrollmentText: 'Already enrolled',
};
