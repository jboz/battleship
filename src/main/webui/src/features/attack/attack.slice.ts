import { createSlice } from '@reduxjs/toolkit';
import GameApi from '../../app/api.service';
import { clone, initTiles } from '../../app/components/utils';
import { AttackTile, Coordinate, PlayerId } from '../../app/model';
import { asyncThunk } from '../../app/store/hooks';
import { RootState } from '../../app/store/store';
import { selectGameCode } from '../game/game.slice';

interface AttackState {
  target?: PlayerId;
  tiles: AttackTile[];
}

const initialState: AttackState = {
  tiles: initTiles<AttackTile>()
};

export const hit = asyncThunk<void, Coordinate>('attack/hit', (coord, { getState }) => {
  const code = selectGameCode(getState());
  const target = selectTarget(getState());
  if (target) {
    GameApi.hit(code, target, coord);
  }
});

export const attackSlice = createSlice({
  name: 'attack',
  initialState,
  reducers: {}
});

export const { reducer: attackReducer } = attackSlice;

export const selectTarget = (state: RootState) => state.attack.target;
export const selectAttackTiles = (state: RootState) => clone(state.attack.tiles);
