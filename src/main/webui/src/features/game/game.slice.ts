import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import GameApi from '../../app/api.service';
import { Game, GameJoining } from '../../app/model';
import { RootState } from '../../app/store/store';

const initialState: Game = {
  code: ''
};

export const create = createAsyncThunk('attack/hit', (request: GameJoining) => {
  GameApi.create(request).then(setGame);
});

export const join = createAsyncThunk('attack/hit', (request: GameJoining) => {
  request.gameCode && GameApi.join(request.gameCode, request).then(setGame);
});

export const gameSlice = createSlice({
  name: 'attack',
  initialState,
  reducers: {
    setGame: (state, { payload }: PayloadAction<Game>) => {
      state = payload;
    }
  }
});

const { setGame } = gameSlice.actions;

export const { reducer: gameReducer } = gameSlice;

export const selectGameCode = (state: RootState) => state.game.code;
