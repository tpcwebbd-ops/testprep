export interface UploadedVideo {
  url: string;
  name: string;
  key: string;
  uploadedAt: string;
}

export interface VideoStore {
  uploadedVideos: UploadedVideo[];
  addVideos: (videos: UploadedVideo[]) => void;
  removeVideo: (key: string) => void;
  clearAllVideos: () => void;
}
