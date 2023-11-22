import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import GameApi from '../../app/api.service';
import { AttackBoardTile, initTiles } from '../../app/components/utils';
import { AttackTile, Coordinate, PlayerId, Tile } from '../../app/model';
import { createAsyncThunk } from '../../app/store/hooks';
import { RootState } from '../../app/store/store';
import { selectGameCode } from '../game.slice';

interface AttackState {
  target?: PlayerId;
  tiles: AttackBoardTile[];
}

const initialState: AttackState = {
  tiles: initTiles<AttackBoardTile>()
};

export const shot = createAsyncThunk<Tile[], Coordinate>('attack/shot', (coord, { getState }) => {
  const code = selectGameCode(getState());
  const target = selectAttackTarget(getState());
  return GameApi.shot(code!, target!, coord);
});

export const attackSlice = createSlice({
  name: 'attack',
  initialState,
  reducers: {
    setTarget: (state, { payload }: PayloadAction<PlayerId>) => {
      state.target = payload;
    },
    setTiles: (state, { payload }: PayloadAction<AttackTile[]>) => {
      state.tiles = state.tiles.map(tile => {
        const serverTile = findTile(payload, tile.coord);
        return {
          ...tile,
          ...serverTile,
          color: serverTile?.destroyedShipdId ? '#101010' : serverTile?.touched ? '#65000b' : serverTile?.hitted ? '#828282' : '#e6e2f1'
        } as AttackBoardTile;
      });
    }
  }
});

const findTile = (tiles: AttackTile[], coord: Coordinate) => tiles.find(tile => tile.coord.x === coord.x && tile.coord.y === coord.y);

export const { setTarget: setTargetPlayer, setTiles: setAttackTiles } = attackSlice.actions;

export const selectAttackTarget = (state: RootState) => state.attack.target;
export const selectAttackTiles = (state: RootState) => state.attack.tiles;
