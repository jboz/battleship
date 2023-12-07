import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Coordinate } from '../../app/model';
import { RootState } from '../../app/store/store';

interface ShotsLogState {
  logs: Log[];
}

export interface Log {
  timestamp: string;
  coord: Coordinate;
}

const initialState: ShotsLogState = { logs: [] };

export const shotsLogSlice = createSlice({
  name: 'shotsLog',
  initialState,
  reducers: {
    restoreDefaultState: state => (state = { ...initialState }),
    log: (state, { payload: coord }: PayloadAction<Coordinate>) => {
      state.logs = [...state.logs, { timestamp: new Date().toISOString(), coord }].reverse();
    }
  }
});

export const { log, restoreDefaultState } = shotsLogSlice.actions;

export const { reducer: errorsReducer } = shotsLogSlice;

export const selectLogs = (state: RootState) => state.shotLog.logs;
