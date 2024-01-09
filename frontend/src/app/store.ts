import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import loadedAOIReducer from '../features/loadedAOISlice';

export const store = configureStore({
  reducer: {
    loadedAOI: loadedAOIReducer,
  },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>