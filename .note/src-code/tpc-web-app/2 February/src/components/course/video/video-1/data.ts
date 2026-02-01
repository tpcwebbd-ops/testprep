export interface IVideo1 {
  uid: string;
  name: string;
  description: string;
  duration: number;
  url: string;
  startDate: Date;
  endDate: Date;
}

export const mockVideo1: IVideo1 = {
  uid: 'video-uid-1',
  name: 'Video 1',
  url: 'https://www.youtube.com/watch?v=1234567890',
  description: 'This is the first video',
  duration: 60,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-01-02'),
};
/*

 
*/
