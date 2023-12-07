import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import GameApi from '../../app/api.service';
import { AttackBoardTile, initTiles } from '../../app/components/utils';
import { AttackTile, Coordinate, PlayerId, Tile } from '../../app/model';
import { createAsyncThunk } from '../../app/store/hooks';
import { RootState } from '../../app/store/store';
import { selectGameCode } from '../game.slice';

interface AttackState {
  player?: PlayerId;
  tiles: AttackBoardTile[];
  bloqued: boolean;
}

const initialState: AttackState = {
  tiles: initTiles<AttackBoardTile>(),
  bloqued: false
};

export const shot = createAsyncThunk<Tile[], Coordinate>('attack/shot', (coord, { getState }) => {
  const code = selectGameCode(getState());
  const target = selectAttackPlayer(getState());
  return GameApi.shot(code!, target!, coord);
});

export const attackSlice = createSlice({
  name: 'attack',
  initialState,
  reducers: {
    restoreDefaultState: state => (state = { ...initialState }),
    setPlayer: (state, { payload: target }: PayloadAction<PlayerId>) => {
      state.player = target;
    },
    setTiles: (state, { payload: tiles }: PayloadAction<AttackTile[]>) => {
      state.tiles = state.tiles.map(tile => {
        const serverTile = findTile(tiles, tile.coord);
        return {
          ...tile,
          ...serverTile,
          color: serverTile?.destroyedShipdId ? '#101010' : serverTile?.touched ? '#65000b' : serverTile?.hitted ? '#828282' : '#e6e2f1'
        } as AttackBoardTile;
      });
    },
    setBloqued: (state, { payload: bloqued }: PayloadAction<boolean>) => {
      state.bloqued = bloqued;
    }
  }
});

const findTile = (tiles: AttackTile[], coord: Coordinate) => tiles.find(tile => tile.coord.x === coord.x && tile.coord.y === coord.y);

export const {
  setPlayer: setAttackPlayer,
  setTiles: setAttackTiles,
  restoreDefaultState,
  setBloqued: setAttackBloqued
} = attackSlice.actions;

export const selectAttackPlayer = (state: RootState) => state.attack.player;
export const selectAttackTiles = (state: RootState) => state.attack.tiles;
export const selectAttackBoardBloqued = (state: RootState) => state.attack.bloqued;
