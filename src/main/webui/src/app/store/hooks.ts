import { AsyncThunk, AsyncThunkPayloadCreator, CombinedState, createAsyncThunk } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

interface ThunkAPI {
  dispatch: AppDispatch;
  state: CombinedState<RootState>;
}

export const asyncThunk = <Returned, Input = void>(
  typePrefix: string,
  thunk: AsyncThunkPayloadCreator<Returned, Input, ThunkAPI>
): AsyncThunk<Returned, Input, ThunkAPI> => {
  return createAsyncThunk<Returned, Input, ThunkAPI>(typePrefix, (arg: Input, thunkAPI) => {
    try {
      return Promise.resolve(thunk(arg, thunkAPI)).catch((err: Error) => thunkAPI.rejectWithValue(err));
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  });
};
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
