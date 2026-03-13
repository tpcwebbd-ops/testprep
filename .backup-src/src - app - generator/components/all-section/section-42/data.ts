export interface IStatItem {
  number: string;
  label: string;
}

export interface ISection42Data {
  badgeText: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  stats: IStatItem[];
}

export interface Section42Props {
  data?: ISection42Data | string;
}

export const defaultDataSection42: ISection42Data = {
  badgeText: '★ We Are Also Providing',
  headingPrefix: 'The Best',
  headingHighlight: 'Study Abroad',
  headingSuffix: 'Services',
  stats: [
    { number: '5000+', label: 'Students Placed' },
    { number: '50+', label: 'Universities' },
    { number: '15+', label: 'Countries' },
    { number: '98%', label: 'Success Rate' },
  ],
};
