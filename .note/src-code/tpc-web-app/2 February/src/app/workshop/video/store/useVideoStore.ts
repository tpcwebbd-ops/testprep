// store/useVideoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoStore } from './type';

export const useVideoStore = create<VideoStore>()(
  persist(
    set => ({
      uploadedVideos: [],
      addVideos: videos =>
        set(state => ({
          uploadedVideos: [...state.uploadedVideos, ...videos],
        })),
      removeVideo: key =>
        set(state => ({
          uploadedVideos: state.uploadedVideos.filter(video => video.key !== key),
        })),
      clearAllVideos: () => set({ uploadedVideos: [] }),
    }),
    {
      name: 'video-storage',
    },
  ),
);
