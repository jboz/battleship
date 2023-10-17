import { createSlice } from '@reduxjs/toolkit';
import { HomeBoardTile, clone, initTiles } from '../../app/components/utils';
import { PlayerId } from '../../app/model';
import { RootState } from '../../app/store/store';

interface HomeState {
  source?: PlayerId;
  tiles: HomeBoardTile[];
}

const initialState: HomeState = {
  tiles: initTiles<HomeBoardTile>()
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {}
});

export const { reducer: homeReducer } = homeSlice;

export const selectSource = (state: RootState) => state.home.source;
export const selectHomeTiles = (state: RootState) => clone(state.home.tiles);
