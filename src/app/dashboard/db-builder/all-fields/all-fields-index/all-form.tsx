/*
|-----------------------------------------
| setting up Allfield for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import AddField1 from '../field-1/Add';
import AddField2 from '../field-2/Add';
import AddField3 from '../field-3/Add';
import AddField4 from '../field-4/Add';
import AddField5 from '../field-5/Add';
import AddField6 from '../field-6/Add';
import AddField7 from '../field-7/Add';
import AddField8 from '../field-8/Add';
import AddField9 from '../field-9/Add';
import AddField10 from '../field-10/Add';
import AddField11 from '../field-11/Add';
import AddField12 from '../field-12/Add';
import AddField13 from '../field-13/Add';
import AddField14 from '../field-14/Add';
import AddField15 from '../field-15/Add';
import AddField16 from '../field-16/Add';
import AddField17 from '../field-17/Add';
import AddField18 from '../field-18/Add';
import AddField19 from '../field-19/Add';
import AddField20 from '../field-20/Add';
import AddField21 from '../field-21/Add';
import AddField22 from '../field-22/Add';
import AddField23 from '../field-23/Add';
import AddField24 from '../field-24/Add';
import AddField25 from '../field-25/Add';
import AddField26 from '../field-26/Add';
import AddField27 from '../field-27/Add';

import UpdateField1 from '../field-1/Update';
import UpdateField2 from '../field-2/Update';
import UpdateField3 from '../field-3/Update';
import UpdateField4 from '../field-4/Update';
import UpdateField5 from '../field-5/Update';
import UpdateField6 from '../field-6/Update';
import UpdateField7 from '../field-7/Update';
import UpdateField8 from '../field-8/Update';
import UpdateField9 from '../field-9/Update';
import UpdateField10 from '../field-10/Update';
import UpdateField11 from '../field-11/Update';
import UpdateField12 from '../field-12/Update';
import UpdateField13 from '../field-13/Update';
import UpdateField14 from '../field-14/Update';
import UpdateField15 from '../field-15/Update';
import UpdateField16 from '../field-16/Update';
import UpdateField17 from '../field-17/Update';
import UpdateField18 from '../field-18/Update';
import UpdateField19 from '../field-19/Update';
import UpdateField20 from '../field-20/Update';
import UpdateField21 from '../field-21/Update';
import UpdateField22 from '../field-22/Update';
import UpdateField23 from '../field-23/Update';
import UpdateField24 from '../field-24/Update';
import UpdateField25 from '../field-25/Update';
import UpdateField26 from '../field-26/Update';
import UpdateField27 from '../field-27/Update';

import ViewField1 from '../field-1/View';
import ViewField2 from '../field-2/View';
import ViewField3 from '../field-3/View';
import ViewField4 from '../field-4/View';
import ViewField5 from '../field-5/View';
import ViewField6 from '../field-6/View';
import ViewField7 from '../field-7/View';
import ViewField8 from '../field-8/View';
import ViewField9 from '../field-9/View';
import ViewField10 from '../field-10/View';
import ViewField11 from '../field-11/View';
import ViewField12 from '../field-12/View';
import ViewField13 from '../field-13/View';
import ViewField14 from '../field-14/View';
import ViewField15 from '../field-15/View';
import ViewField16 from '../field-16/View';
import ViewField17 from '../field-17/View';
import ViewField18 from '../field-18/View';
import ViewField19 from '../field-19/View';
import ViewField20 from '../field-20/View';
import ViewField21 from '../field-21/View';
import ViewField22 from '../field-22/View';
import ViewField23 from '../field-23/View';
import ViewField24 from '../field-24/View';
import ViewField25 from '../field-25/View';
import ViewField26 from '../field-26/View';
import ViewField27 from '../field-27/View';

import { defaultDatafield1, Ifield1Data } from '../field-1/data';
import { defaultDatafield2, Ifield2Data } from '../field-2/data';
import { defaultDatafield3, Ifield3Data } from '../field-3/data';
import { defaultDatafield4, Ifield4Data } from '../field-4/data';
import { defaultDatafield5, Ifield5Data } from '../field-5/data';
import { defaultDatafield6, Ifield6Data } from '../field-6/data';
import { defaultDatafield7, Ifield7Data } from '../field-7/data';
import { defaultDatafield8, Ifield8Data } from '../field-8/data';
import { defaultDatafield9, Ifield9Data } from '../field-9/data';
import { defaultDatafield10, Ifield10Data } from '../field-10/data';
import { defaultDatafield11, Ifield11Data } from '../field-11/data';
import { defaultDatafield12, Ifield12Data } from '../field-12/data';
import { defaultDatafield13, Ifield13Data } from '../field-13/data';
import { defaultDatafield14, Ifield14Data } from '../field-14/data';
import { defaultDatafield15, Ifield15Data } from '../field-15/data';
import { defaultDatafield16, Ifield16Data } from '../field-16/data';
import { defaultDatafield17, Ifield17Data } from '../field-17/data';
import { defaultDatafield18, Ifield18Data } from '../field-18/data';
import { defaultDatafield19, Ifield19Data } from '../field-19/data';
import { defaultDatafield20, Ifield20Data } from '../field-20/data';
import { defaultDatafield21, Ifield21Data } from '../field-21/data';
import { defaultDatafield22, Ifield22Data } from '../field-22/data';
import { defaultDatafield23, Ifield23Data } from '../field-23/data';
import { defaultDatafield24, Ifield24Data } from '../field-24/data';
import { defaultDatafield25, Ifield25Data } from '../field-25/data';
import { defaultDatafield26, Ifield26Data } from '../field-26/data';
import { defaultDatafield27, Ifield27Data } from '../field-27/data';

export type { Ifield1Data, Ifield2Data, Ifield3Data, Ifield4Data, Ifield5Data, Ifield6Data, Ifield7Data, Ifield8Data, Ifield9Data, Ifield10Data, Ifield11Data, Ifield12Data, Ifield13Data, Ifield14Data, Ifield15Data, Ifield16Data, Ifield17Data, Ifield18Data, Ifield19Data, Ifield20Data, Ifield21Data, Ifield22Data, Ifield23Data, Ifield24Data, Ifield25Data, Ifield26Data, Ifield27Data };

export const Allfields = {
  'field-uid-1': {
    add: AddField1,
    update: UpdateField1,
    view: ViewField1,
    data: defaultDatafield1,
  },
  'field-uid-2': {
    add: AddField2,
    update: UpdateField2,
    view: ViewField2,
    data: defaultDatafield2,
  },
  'field-uid-3': {
    add: AddField3,
    update: UpdateField3,
    view: ViewField3,
    data: defaultDatafield3,
  },
  'field-uid-4': {
    add: AddField4,
    update: UpdateField4,
    view: ViewField4,
    data: defaultDatafield4,
  },
  'field-uid-5': {
    add: AddField5,
    update: UpdateField5,
    view: ViewField5,
    data: defaultDatafield5,
  },
  'field-uid-6': {
    add: AddField6,
    update: UpdateField6,
    view: ViewField6,
    data: defaultDatafield6,
  },
  'field-uid-7': {
    add: AddField7,
    update: UpdateField7,
    view: ViewField7,
    data: defaultDatafield7,
  },
  'field-uid-8': {
    add: AddField8,
    update: UpdateField8,
    view: ViewField8,
    data: defaultDatafield8,
  },
  'field-uid-9': {
    add: AddField9,
    update: UpdateField9,
    view: ViewField9,
    data: defaultDatafield9,
  },
  'field-uid-10': {
    add: AddField10,
    update: UpdateField10,
    view: ViewField10,
    data: defaultDatafield10,
  },
  'field-uid-11': {
    add: AddField11,
    update: UpdateField11,
    view: ViewField11,
    data: defaultDatafield11,
  },
  'field-uid-12': {
    add: AddField12,
    update: UpdateField12,
    view: ViewField12,
    data: defaultDatafield12,
  },
  'field-uid-13': {
    add: AddField13,
    update: UpdateField13,
    view: ViewField13,
    data: defaultDatafield13,
  },
  'field-uid-14': {
    add: AddField14,
    update: UpdateField14,
    view: ViewField14,
    data: defaultDatafield14,
  },
  'field-uid-15': {
    add: AddField15,
    update: UpdateField15,
    view: ViewField15,
    data: defaultDatafield15,
  },
  'field-uid-16': {
    add: AddField16,
    update: UpdateField16,
    view: ViewField16,
    data: defaultDatafield16,
  },
  'field-uid-17': {
    add: AddField17,
    update: UpdateField17,
    view: ViewField17,
    data: defaultDatafield17,
  },
  'field-uid-18': {
    add: AddField18,
    update: UpdateField18,
    view: ViewField18,
    data: defaultDatafield18,
  },
  'field-uid-19': {
    add: AddField19,
    update: UpdateField19,
    view: ViewField19,
    data: defaultDatafield19,
  },
  'field-uid-20': {
    add: AddField20,
    update: UpdateField20,
    view: ViewField20,
    data: defaultDatafield20,
  },
  'field-uid-21': {
    add: AddField21,
    update: UpdateField21,
    view: ViewField21,
    data: defaultDatafield21,
  },
  'field-uid-22': {
    add: AddField22,
    update: UpdateField22,
    view: ViewField22,
    data: defaultDatafield22,
  },
  'field-uid-23': {
    add: AddField23,
    update: UpdateField23,
    view: ViewField23,
    data: defaultDatafield23,
  },
  'field-uid-24': {
    add: AddField24,
    update: UpdateField24,
    view: ViewField24,
    data: defaultDatafield24,
  },
  'field-uid-25': {
    add: AddField25,
    update: UpdateField25,
    view: ViewField25,
    data: defaultDatafield25,
  },
  'field-uid-26': {
    add: AddField26,
    update: UpdateField26,
    view: ViewField26,
    data: defaultDatafield26,
  },
  'field-uid-27': {
    add: AddField27,
    update: UpdateField27,
    view: ViewField27,
    data: defaultDatafield27,
  },
};

export const AllfieldsKeys = Object.keys(Allfields);


