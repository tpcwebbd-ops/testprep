export interface ISection33Data {
  subTitle: string;
  countText: string;
  avatarUrls: string[];
}

export interface Section33Props {
  data?: ISection33Data | string;
}

export const defaultDataSection33: ISection33Data = {
  subTitle: 'Join thousands who achieved their dreams',
  countText: '+50,000 students',
  avatarUrls: [
    'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  ],
};
