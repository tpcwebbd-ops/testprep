/*
|-----------------------------------------
| setting up Redux Provider for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, February, 2024
|-----------------------------------------
*/

'use client';

import { store } from '@/redux/app/store';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

export function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
