// all-footer-index.tsx
import { mockAssignments1 } from '../assignment-1/data';

import MutationAssignment1 from '../assignment-1/MutationFooter';

import QueryAssignment1 from '../assignment-1/QueryFooter';

export const AllAssignments = {
  'assignment-uid-1': { mutation: MutationAssignment1, query: QueryAssignment1, data: mockAssignments1 },
};

export const AllAssignmentsKeys = Object.keys(AllAssignments);
