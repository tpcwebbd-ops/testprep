export interface LogoProps {
  data?: ILogoData | string;
}

export interface ILogoItem {
  id: string;
  image: string;
  alt: string;
  link?: string;
}

export type NavPosition = 'middle-outside' | 'bottom-outside' | 'hidden';

export interface ILogoData {
  logos: ILogoItem[];

  // Responsive Settings (Items per view)
  responsive: {
    mobile: number; // < 640px
    tablet: number; // 640px - 1024px
    desktop: number; // > 1024px
  };

  // Playback
  autoplaySpeed: number;
  isAutoplay: boolean;
  infiniteLoop: boolean;
  pauseOnHover: boolean;

  // Layout & Nav
  navPosition: NavPosition;
  gap: 'sm' | 'md' | 'lg' | 'xl';
  grayscale: boolean; // If true, logos are B&W until hovered
}

export const defaultDataSection27: ILogoData = {
  logos: [
    { id: '1', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', alt: 'Google' },
    { id: '2', image: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg', alt: 'Facebook' },
    { id: '3', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg', alt: 'Twitter' },
    { id: '4', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg', alt: 'Instagram' },
    { id: '5', image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', alt: 'Netflix' },
    { id: '6', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', alt: 'Amazon' },
  ],
  responsive: {
    mobile: 2,
    tablet: 3,
    desktop: 5,
  },
  autoplaySpeed: 3000,
  isAutoplay: true,
  infiniteLoop: true,
  pauseOnHover: true,
  navPosition: 'hidden', // Logos usually look best without arrows, but feature is supported
  gap: 'lg',
  grayscale: true,
};

export interface LogoFormProps {
  data?: ILogoData;
  onSubmit: (values: ILogoData) => void;
}
