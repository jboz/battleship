import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { JsonProblem } from './errors.model';

interface ErrorsState {
  errors: Array<JsonProblem | string>;
}

const initialState: ErrorsState = { errors: [] };

export const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    addError: (state, { payload: error }: PayloadAction<JsonProblem | string>) => {
      state.errors = [...state.errors, error];
    },
    clearErrors: state => {
      state.errors = [];
    }
  }
});

export const { addError, clearErrors } = errorsSlice.actions;

export const { reducer: errorsReducer } = errorsSlice;

export const selectErrors = (state: RootState) => state.errors.errors;
