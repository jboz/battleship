import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeBoardTile, initTiles } from '../../app/components/utils';
import { Coordinate, HomeTile, PlayerId } from '../../app/model';
import { RootState } from '../../app/store/store';
import { getMatchBoardTiles, getNextShip } from './home-stote.utils';

type PlacementMode = 'vertical' | 'horizontal';

export interface Ship {
  id: string;
  size: number;
  color: string;
  placed?: boolean;
  coords: Coordinate[];
}

interface HomeState {
  source?: PlayerId;
  tiles: HomeBoardTile[];
  ships: Ship[];
  selectedShipId?: string;
  placementMode: PlacementMode;
}

const initialState: HomeState = {
  tiles: initTiles<HomeBoardTile>(),
  ships: [
    { id: 'Carrier', size: 5, color: '#be456e', coords: [] },
    { id: 'Battleship', size: 4, color: '#0494ff', coords: [] },
    { id: 'Cruiser1', size: 3, color: '#04ff8a', coords: [] },
    { id: 'Cruiser2', size: 3, color: '#04ff8a', coords: [] },
    { id: 'Submarine1', size: 3, color: '#04ffde', coords: [] },
    { id: 'Submarine2', size: 3, color: '#04ffde', coords: [] },
    { id: 'Destroyer', size: 2, color: '#af54a0', coords: [] }
  ],
  placementMode: 'horizontal'
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setSelectedShip: (state, { payload }: PayloadAction<Ship>) => {
      const shipId = payload.id;
      const ship = state.ships.find(ship => ship.id === shipId);
      state.selectedShipId = shipId;
      if (!ship) {
        return;
      }
      ship.placed = false;
      ship.coords = [];
      state.tiles
        .filter(tile => tile.shipId === state.selectedShipId)
        .forEach(tile => {
          tile.shipId = undefined;
          tile.color = undefined;
          tile.hoverColor = ship?.color + '55';
        });
    },
    markHover: (state, { payload }: PayloadAction<HomeBoardTile>) => {
      const selectedShip = state.ships.find(s => s.id === state.selectedShipId);
      const hoverTile = payload;
      if (selectedShip && !hoverTile.shipId) {
        const matchTiles = getMatchBoardTiles(selectedShip, hoverTile, state.tiles, state.placementMode);
        if (matchTiles.length !== selectedShip.size) {
          return;
        }
        matchTiles.forEach(tile => (tile.hoverColor = selectedShip.color + '55'));
      }
    },
    unmarkHover: state => {
      state.tiles.forEach(tile => (tile.hoverColor = undefined));
    },
    tryToPlaceShip: (state, { payload }: PayloadAction<HomeBoardTile>) => {
      const selectedShip = state.ships.find(s => s.id === state.selectedShipId);
      if (!selectedShip) {
        return;
      }
      const matchTiles = getMatchBoardTiles(selectedShip, payload, state.tiles, state.placementMode);
      if (matchTiles.length < selectedShip.size) {
        return;
      }
      selectedShip.placed = true;
      selectedShip.coords = matchTiles.map(s => s.coord);

      matchTiles.forEach(tile => {
        tile.shipId = selectedShip.id;
        tile.color = selectedShip.color;
        tile.hoverColor = undefined;
      });

      state.selectedShipId = getNextShip(selectedShip, state.ships)?.id;
    },
    reset: state => {
      state.ships.map(s => ({ ...s, placed: false, zones: [] }));
      state.tiles.forEach(tile => {
        tile.shipId = undefined;
        tile.color = undefined;
        tile.hoverColor = undefined;
      });
    },
    togglePlacementMode: state => {
      state.placementMode = state.placementMode === 'horizontal' ? 'vertical' : 'horizontal';
    },
    setPlayer: (state, { payload }: PayloadAction<PlayerId>) => {
      state.source = payload;
    },
    setTiles: (state, { payload }: PayloadAction<HomeTile[]>) => {
      if (payload.length === initialState.tiles.length) {
        state.tiles = payload.map(tile => {
          const ship = state.ships.find(s => s.id === tile.shipId);
          if (ship) {
            ship.placed = true;
          }
          return { ...tile, color: tile.hitted ? (ship ? darker(ship?.color) : '#828282') : ship?.color || '#e6e2f1' } as HomeBoardTile;
        });
      }
    }
  }
});

const darker = (color: string) => color + '55';

export const { reducer: homeReducer } = homeSlice;
export const {
  setSelectedShip,
  markHover,
  unmarkHover,
  tryToPlaceShip,
  reset,
  togglePlacementMode,
  setPlayer: setHomePlayer,
  setTiles: setHomeTiles
} = homeSlice.actions;

export const selectShips = (state: RootState) => state.home.ships;
export const selectSelectedShip = (state: RootState) => state.home.ships.find(s => s.id === state.home.selectedShipId);
export const selectHomeTiles = (state: RootState) => state.home.tiles;
export const selectPlacementMode = (state: RootState) => state.home.placementMode;
export const selectHomePlayer = (state: RootState) => state.home.source;
