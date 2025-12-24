// all-footer-index.tsx
import { mockVideo1 } from '../video-1/data';

import MutationAssignment1 from '../video-1/Mutation';

import QueryAssignment1 from '../video-1/Query';

export const AllAssignments = {
  'assignment-uid-1': { mutation: MutationAssignment1, query: QueryAssignment1, data: mockVideo1 },
};

export const AllAssignmentsKeys = Object.keys(AllAssignments);
