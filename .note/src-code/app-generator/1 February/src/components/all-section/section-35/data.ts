export interface IFeatureItem {
  title: string;
  subtitle: string;
  iconName: string; // 'FileText' | 'Clock' | 'Target' etc.
  iconColorClass: string; // e.g., 'text-red-500'
  bgColorClass: string; // e.g., 'bg-red-100'
}

export interface IStatItem {
  value: string;
  label: string;
  colorClass: string; // e.g., 'text-red-500'
}

export interface ISection35Data {
  features: IFeatureItem[];
  stats: IStatItem[];
  ctaText: string;
  ctaLink: string;
}

export interface Section35Props {
  data?: ISection35Data | string;
}

export const defaultDataSection35: ISection35Data = {
  features: [
    {
      title: 'Real Test Format',
      subtitle: 'Authentic IELTS exam experience',
      iconName: 'FileText',
      iconColorClass: 'text-red-500',
      bgColorClass: 'bg-red-100',
    },
    {
      title: 'Instant Results',
      subtitle: 'Get your scores immediately',
      iconName: 'Clock',
      iconColorClass: 'text-orange-500',
      bgColorClass: 'bg-orange-100',
    },
    {
      title: 'Detailed Explanation',
      subtitle: 'Learn from every question',
      iconName: 'Target',
      iconColorClass: 'text-green-500',
      bgColorClass: 'bg-green-100',
    },
  ],
  stats: [
    { value: '50K+', label: 'Students Tested', colorClass: 'text-red-500' },
    { value: '8.5', label: 'Average Band Score', colorClass: 'text-orange-500' },
    { value: '95%', label: 'Success Rate', colorClass: 'text-green-500' },
  ],
  ctaText: 'TAKE A TEST',
  ctaLink: '/test',
};
