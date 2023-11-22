import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import GameApi from '../app/api.service';
import { addError } from '../app/errors/errors.slice';
import { FinishedEvent, Game, GameJoining, PlayerEvent, PlayerId } from '../app/model';
import { createAsyncThunk } from '../app/store/hooks';
import { RootState } from '../app/store/store';
import { setAttackTiles, setTargetPlayer } from './attack/attack.slice';
import { clearShipSelection, selectHomePlayer, setHomePlayer, setHomeTiles } from './home/home.slice';

interface GameState {
  game?: Game;
}

const initialState: GameState = {};

export const create = createAsyncThunk('game/create', (request: GameJoining, { dispatch }) => {
  return GameApi.create(request).then(game => {
    dispatch(setGame(game));
    dispatch(setHomePlayer(game.player1 === request.player ? PlayerId.player1 : PlayerId.player2));
    dispatch(setTargetPlayer(game.player1 === request.player ? PlayerId.player1 : PlayerId.player2));
    dispatch(listen());
  });
});

export const join = createAsyncThunk('game/join', (request: GameJoining, { dispatch }) => {
  return GameApi.join(request.gameCode || '', request).then(game => {
    dispatch(setGame(game));
    dispatch(setHomePlayer(game.player1 === request.player ? PlayerId.player1 : PlayerId.player2));
    dispatch(setTargetPlayer(game.player1 === request.player ? PlayerId.player2 : PlayerId.player1));
    dispatch(clearShipSelection());
    dispatch(listen());
  });
});

const listen = createAsyncThunk('game/listen', (_, { dispatch, getState }) => {
  const code = selectGameCode(getState());
  const player = selectHomePlayer(getState());
  if (code && player) {
    const connection = GameApi.connect(code, player);
    connection.addEventListener('PlayerEvent', event => {
      const payload = JSON.parse(event.data) as PlayerEvent;
      dispatch(setHomeTiles(payload.player.homeBoard.tiles));
      dispatch(setAttackTiles(payload.player.attackBoard.tiles));
    });
    connection.addEventListener('FinishEvent', event => {
      const content = JSON.parse(event.data) as FinishedEvent;
      console.log(`finished`, content);
    });
    connection.onerror = () => dispatch(addError('Error during event streaming'));
  }
  return Promise.resolve();
});

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGame: (state, { payload }: PayloadAction<Game>) => {
      state.game = { ...payload };
    }
  }
});

const { setGame } = gameSlice.actions;

export const selectGameConnected = (state: RootState) => !!state.game.game;
export const selectGameCode = (state: RootState) => state.game.game?.code;
export const selectHomePlayerName = (state: RootState) =>
  state.home.source === PlayerId.player1 ? state.game.game?.player1 : state.game.game?.player2;
export const selectAttackPlayerName = (state: RootState) =>
  state.attack.target === PlayerId.player1 ? state.game.game?.player1 : state.game.game?.player2;
