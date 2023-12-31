import { AsyncThunk, AsyncThunkPayloadCreator, CombinedState, createAsyncThunk as createAsyncThunkBase } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch as useBaseDispatch, useSelector as useBaseSelector } from 'react-redux';
import { JsonProblemError } from '../errors/errors.model';
import { addError, clearErrors } from '../errors/errors.slice';
import type { AppDispatch, RootState } from './store';

interface ThunkAPI {
  dispatch: AppDispatch;
  state: CombinedState<RootState>;
}

export const createAsyncThunk = <Returned, Input = void>(
  typePrefix: string,
  thunk: AsyncThunkPayloadCreator<Promise<Returned>, Input, ThunkAPI>
): AsyncThunk<Returned, Input, ThunkAPI> => {
  return createAsyncThunkBase<Returned, Input, ThunkAPI>(typePrefix, (arg: Input, thunkAPI) => {
    try {
      thunkAPI.dispatch(clearErrors());
      return Promise.resolve(thunk(arg, thunkAPI)).catch((err: Error) => {
        if (err instanceof JsonProblemError) {
          thunkAPI.dispatch(addError(err.problem));
          return thunkAPI.rejectWithValue(err.problem);
        }
        return thunkAPI.rejectWithValue(err);
      });
    } catch (err) {
      if (err instanceof JsonProblemError) {
        thunkAPI.dispatch(addError(err.problem));
        return thunkAPI.rejectWithValue(err.problem);
      }
      return thunkAPI.rejectWithValue(err);
    }
  });
};
export const useDispatch = () => useBaseDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useBaseSelector;
