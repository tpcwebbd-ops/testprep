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

Look at the mock Data.ts 
```
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
```

Now Your task is create two file with this data. 
1. Mutation.tsx 
  this file is upload the Video. and here I can edit all others element.
2. Query.tsx 
  in this file data is shown in card component. make it eye-catching view and stunning animation. 

  here is example of Video Uploader.tsx
  ```

  ```
  

*/
