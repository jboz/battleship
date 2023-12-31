import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import GameApi from '../ core/api.service';
import { addError, restoreDefaultState as restoreDefaultStateErrors } from '../ core/errors/errors.slice';
import { FinishedEvent, Game, GameJoining, PlayerEvent, PlayerId, PlayerJoinedEvent, ShotEvent } from '../ core/model';
import { createAsyncThunk } from '../ core/store/hooks';
import { RootState } from '../ core/store/store';
import { restoreDefaultState as restoreDefaultStateAttack, setAttackBloqued, setAttackPlayer, setAttackTiles } from './attack/attack.slice';
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
  winner?: string;
}

const initialState: GameState = {};

export const create = createAsyncThunk('game/create', async (request: GameJoining, { dispatch }) => {
  const game = await GameApi.create(request);
  dispatch(setGame(game));
  dispatch(setHomePlayer(game.player1 === request.player ? PlayerId.player1 : PlayerId.player2));
  dispatch(listen());
});

export const join = createAsyncThunk('game/join', async (request: GameJoining, { dispatch }) => {
  const game = await GameApi.join(request.gameCode || '', request);
  dispatch(setGame(game));
  const homePlayer = game.player1 === request.player ? PlayerId.player1 : PlayerId.player2;
  dispatch(setHomePlayer(homePlayer));
  const attackePlayer = game.player1 === request.player ? PlayerId.player2 : PlayerId.player1;
  dispatch(setAttackPlayer(attackePlayer));
  dispatch(clearShipSelection());
  dispatch(setAttackBloqued(!!game.nextPlayer && game.nextPlayer !== homePlayer));
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
  const homePlayer = selectHomePlayer(getState());
  if (code && homePlayer) {
    const connection = GameApi.connect(code, homePlayer);
    setConnection(connection);
    connection.addEventListener('PlayerJoinedEvent', event => {
      const payload = JSON.parse(event.data) as PlayerJoinedEvent;
      dispatch(setAttackPlayerName(payload.joinedPlayerName));
      dispatch(setAttackPlayer(PlayerId.player2));
    });
    connection.addEventListener('PlayerEvent', event => {
      const payload = JSON.parse(event.data) as PlayerEvent;
      dispatch(setHomeTiles(payload.player.homeBoard.tiles));
      dispatch(setAttackTiles(payload.player.attackBoard.tiles));
    });
    connection.addEventListener('FinishEvent', event => {
      const payload = JSON.parse(event.data) as FinishedEvent;
      dispatch(setWinner(payload.winner));
    });
    connection.addEventListener('ShotEvent', event => {
      const shot = JSON.parse(event.data) as ShotEvent;
      if (shot.source === homePlayer) {
        dispatch(log(shot.shot));
      }
      dispatch(setAttackBloqued(shot.nextPlayer !== homePlayer));
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
      state.winner = undefined;
    },
    setGame: (state, { payload: game }: PayloadAction<Game>) => {
      state.game = { ...game };
    },
    setAttackPlayerName: (state, { payload: player2 }: PayloadAction<string>) => {
      if (state.game) {
        state.game = { ...state.game, player2 };
      }
    },
    setConnection: (state, { payload: connection }: PayloadAction<EventSource>) => {
      state.connection = connection;
    },
    setWinner: (state, { payload: winner }: PayloadAction<string>) => {
      state.winner = winner;
    }
  }
});

const { setGame, setConnection, restoreDefaultState, setAttackPlayerName, setWinner } = gameSlice.actions;

export const selectGameConnected = (state: RootState) => {
  return !!state.game.game;
};
export const selectGameCode = (state: RootState) => state.game.game?.code;
export const selectHomePlayerName = (state: RootState) =>
  state.home.player === PlayerId.player1 ? state.game.game?.player1 : state.game.game?.player2;
export const selectAttackPlayerName = (state: RootState) =>
  state.attack.player === PlayerId.player1 ? state.game.game?.player1 : state.game.game?.player2;
export const selectWinner = (state: RootState) => state.game.winner;
