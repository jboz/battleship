import { AsyncThunk, AsyncThunkPayloadCreator, CombinedState, createAsyncThunk as createAsyncThunkBase } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch as useBaseDispatch, useSelector as useBaseSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

interface ThunkAPI {
  dispatch: AppDispatch;
  state: CombinedState<RootState>;
}

export const createAsyncThunk = <Returned, Input = void>(
  typePrefix: string,
  thunk: AsyncThunkPayloadCreator<Returned, Input, ThunkAPI>
): AsyncThunk<Returned, Input, ThunkAPI> => {
  return createAsyncThunkBase<Returned, Input, ThunkAPI>(typePrefix, (arg: Input, thunkAPI) => {
    try {
      return Promise.resolve(thunk(arg, thunkAPI)).catch((err: Error) => thunkAPI.rejectWithValue(err));
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  });
};
export const useDispatch = () => useBaseDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useBaseSelector;
