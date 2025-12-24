// all-footer-index.tsx
import { mockVideo1 } from '../video-1/data';

import MutationAssignment1 from '../video-1/Mutation';

import QueryAssignment1 from '../video-1/Query';

export const AllVideos = {
  'video-uid-1': { mutation: MutationAssignment1, query: QueryAssignment1, data: mockVideo1 },
};

export const AllVideosKeys = Object.keys(AllVideos);
