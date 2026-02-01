export interface ISection10Data {
  id: string;
  title: string;
  subTitle: string;
  description: string;
}

export interface Section10Props {
  data?: ISection10Data | string;
}

export const defaultDataSection10: ISection10Data = {
  id: 'Section 10 Button Text',
  title: 'Success',
  subTitle: 'Stories',
  description: 'Scroll down to witness the journey of excellence. One story at a time.',
};
