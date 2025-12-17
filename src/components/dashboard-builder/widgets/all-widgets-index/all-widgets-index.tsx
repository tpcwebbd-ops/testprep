import { mockWidgets1 } from '../widgets-1/data';
import MutationWidgets1 from '../widgets-1/MutationWidgets1';
import Widgets1 from '../widgets-1/QueryWidgets1';

export const AllWidgets = {
  'widgets-uid-1': { name: 'STRING', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-2': { name: 'EMAIL', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-3': { name: 'PASSWORD', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-4': { name: 'PASSCODE', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-5': { name: 'SELECT', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-6': { name: 'STRINGARRAY', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-7': { name: 'IMAGES', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-8': { name: 'IMAGE', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-9': { name: 'DESCRIPTION', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-10': { name: 'INTNUMBER', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-11': { name: 'FLOATNUMBER', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-12': { name: 'BOOLEAN', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-13': { name: 'JsonValueField', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-14': { name: 'DYNAMICSELECT', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-15': { name: 'DATE', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-16': { name: 'TIME', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-17': { name: 'DATERANGE', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-18': { name: 'TIMERANGE', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-19': { name: 'COLORPICKER', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-20': { name: 'PHONE', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-21': { name: 'URL', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-22': { name: 'RICHTEXT', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-23': { name: 'AUTOCOMPLETE', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-24': { name: 'RADIOBUTTON', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-25': { name: 'CHECKBOX', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-26': { name: 'MULTICHECKBOX', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
  'widgets-uid-27': { name: 'MULTIOPTIONS', mutation: MutationWidgets1, query: Widgets1, data: mockWidgets1 },
};

export const AllWidgetsKeys = Object.keys(AllWidgets);
