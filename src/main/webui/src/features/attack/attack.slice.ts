import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import GameApi from '../../app/api.service';
import { AttackBoardTile, initTiles } from '../../app/components/utils';
import { AttackTile, Coordinate, PlayerId } from '../../app/model';
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

export const hit = createAsyncThunk<void, Coordinate>('attack/hit', (coord, { getState }) => {
  const code = selectGameCode(getState());
  const target = selectAttackTarget(getState());
  if (code && target) {
    GameApi.hit(code, target, coord);
  }
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
          color: serverTile?.touched ? '#65000b' : serverTile?.hitted ? '#828282' : '#e6e2f1'
        } as AttackBoardTile;
      });
    }
  }
});

const findTile = (tiles: AttackTile[], coord: Coordinate) => tiles.find(tile => tile.coord.x === coord.x && tile.coord.y === coord.y);

export const { reducer: attackReducer } = attackSlice;
export const { setTarget: setTargetPlayer, setTiles: setAttackTiles } = attackSlice.actions;

export const selectAttackTarget = (state: RootState) => state.attack.target;
export const selectAttackTiles = (state: RootState) => state.attack.tiles;
