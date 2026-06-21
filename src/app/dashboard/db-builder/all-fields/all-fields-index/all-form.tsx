/*
|-----------------------------------------
| setting up Allfield for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import AddField1 from '../field-1/Add';
import AddField2 from '../field-2/Add';

import UpdateField1 from '../field-1/Update';
import UpdateField2 from '../field-2/Update';

import { defaultDatafield1, Ifield1Data } from '../field-1/data';
import { defaultDatafield2, Ifield2Data } from '../field-2/data';

export type { Ifield1Data, Ifield2Data };

export const Allfields = {
  'field-uid-1': {
    add: AddField1,
    update: UpdateField1,
    data: defaultDatafield1,
  },
  'field-uid-2': {
    add: AddField2,
    update: UpdateField2,
    data: defaultDatafield2,
  },
};

export const AllfieldsKeys = Object.keys(Allfields);
