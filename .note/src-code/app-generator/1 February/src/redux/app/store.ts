/*
|-----------------------------------------
| setting up Store for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, February, 2024
|-----------------------------------------
*/
// This template is only for use redux store.

import { configureStore } from '@reduxjs/toolkit';

import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { apiSlice } from '@/redux/api/apiSlice';
import { menuEditorApi } from '@/redux/features/menu-editor/menuEditorSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [menuEditorApi.reducerPath]: menuEditorApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware, menuEditorApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
