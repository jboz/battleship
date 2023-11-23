import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import GameApi from '../app/api.service';
import { addError, restoreDefaultState as restoreDefaultStateErrors } from '../app/errors/errors.slice';
import { Game, GameJoining, PlayerEvent, PlayerId, ShotEvent } from '../app/model';
import { createAsyncThunk } from '../app/store/hooks';
import { RootState } from '../app/store/store';
import { restoreDefaultState as restoreDefaultStateAttack, setAttackTiles, setTargetPlayer } from './attack/attack.slice';
import {
  clearShipSelection,
  restoreDefaultState as restoreDefaultStateHome,
  selectHomePlayer,
  setHomePlayer,
  setHomeTiles
} from './home/home.slice';
import { log, restoreDefaultState as restoreDefaultStateLogs } from './shots-log/shots-log.slice';

interface GameState {
  game?: Game;
  connection?: EventSource;
}

const initialState: GameState = {};

export const create = createAsyncThunk('game/create', async (request: GameJoining, { dispatch }) => {
  const game = await GameApi.create(request);
  dispatch(setGame(game));
  dispatch(setHomePlayer(game.player1 === request.player ? PlayerId.player1 : PlayerId.player2));
  dispatch(setTargetPlayer(game.player1 === request.player ? PlayerId.player1 : PlayerId.player2));
  dispatch(listen());
});

export const join = createAsyncThunk('game/join', async (request: GameJoining, { dispatch }) => {
  const game = await GameApi.join(request.gameCode || '', request);
  dispatch(setGame(game));
  dispatch(setHomePlayer(game.player1 === request.player ? PlayerId.player1 : PlayerId.player2));
  dispatch(setTargetPlayer(game.player1 === request.player ? PlayerId.player2 : PlayerId.player1));
  dispatch(clearShipSelection());
  dispatch(listen());
});

export const disconnect = createAsyncThunk('game/disconnect', (_, { dispatch }) => {
  dispatch(restoreDefaultState());
  dispatch(restoreDefaultStateHome());
  dispatch(restoreDefaultStateAttack());
  dispatch(restoreDefaultStateLogs());
  dispatch(restoreDefaultStateErrors());
  return Promise.resolve();
});

const listen = createAsyncThunk('game/listen', (_, { dispatch, getState }) => {
  const code = selectGameCode(getState());
  const player = selectHomePlayer(getState());
  if (code && player) {
    const connection = GameApi.connect(code, player);
    setConnection(connection);
    connection.addEventListener('PlayerEvent', event => {
      const payload = JSON.parse(event.data) as PlayerEvent;
      dispatch(setHomeTiles(payload.player.homeBoard.tiles));
      dispatch(setAttackTiles(payload.player.attackBoard.tiles));
    });
    connection.addEventListener('FinishEvent', event => {
      //const content = JSON.parse(event.data) as FinishedEvent;
      // TODO forward event
    });
    connection.addEventListener('ShotEvent', event => {
      const content = JSON.parse(event.data) as ShotEvent;
      dispatch(log(content.shot));
    });
    connection.onerror = event => {
      if (event.eventPhase === EventSource.CLOSED) {
        connection.close();
      } else {
        dispatch(addError('Error during event streaming'));
      }
    };
  }
  return Promise.resolve();
});

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    restoreDefaultState: state => {
      if (state.connection) {
        state.connection.close();
      }
      state.game = undefined;
      state.connection = undefined;
    },
    setGame: (state, { payload }: PayloadAction<Game>) => {
      state.game = { ...payload };
    },
    setConnection: (state, { payload: connection }: PayloadAction<EventSource>) => {
      state.connection = connection;
    }
  }
});

const { setGame, setConnection, restoreDefaultState } = gameSlice.actions;

export const selectGameConnected = (state: RootState) => {
  return !!state.game.game;
};
export const selectGameCode = (state: RootState) => state.game.game?.code;
export const selectHomePlayerName = (state: RootState) =>
  state.home.source === PlayerId.player1 ? state.game.game?.player1 : state.game.game?.player2;
export const selectAttackPlayerName = (state: RootState) =>
  state.attack.target === PlayerId.player1 ? state.game.game?.player1 : state.game.game?.player2;
