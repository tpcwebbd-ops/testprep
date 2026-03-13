// all-footer-index.tsx
import { defaultDataFooter1, IFooter1Data } from '../footer-1/data';
import { defaultDataFooter2, IFooter2Data } from '../footer-2/data';

import MutationFooter1 from '../footer-1/MutationFooter';
import MutationFooter2 from '../footer-2/MutationFooter';

import QueryFooter1 from '../footer-1/QueryFooter';
import QueryFooter2 from '../footer-2/QueryFooter';

export type { IFooter1Data, IFooter2Data };

export const AllFooter = {
  'footer-uid-1': { mutation: MutationFooter1, query: QueryFooter1, data: defaultDataFooter1 },
  'footer-uid-2': { mutation: MutationFooter2, query: QueryFooter2, data: defaultDataFooter2 },
};

export const AllFooterKeys = Object.keys(AllFooter);
