import {configureStore} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import discoverySlice from './slices/discoverySlice';
import breadCrumbsSlice from './slices/breadCrumbSlice';
const theStore = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    discovery: discoverySlice.reducer,
    crumbs: breadCrumbsSlice.reducer,
  },
});
export type RootState = ReturnType<typeof theStore.getState>
export type AppDispatch = typeof theStore.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default theStore