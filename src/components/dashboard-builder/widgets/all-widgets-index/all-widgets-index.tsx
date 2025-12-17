// all-footer-index.tsx
import { mockAssignments1 } from '../widgets-1/data';

import MutationAssignment1 from '../widgets-1/MutationFooter';

import QueryAssignment1 from '../widgets-1/QueryFooter';

export const AllWidgets = {
  'widgets-uid-1': { mutation: MutationAssignment1, query: QueryAssignment1, data: mockAssignments1 },
};

export const AllWidgetsKeys = Object.keys(AllWidgets);
