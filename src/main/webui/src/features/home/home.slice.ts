import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeBoardTile, initTiles } from '../../ core/components/board.utils';
import { Coordinate, HomeTile, PlayerId } from '../../ core/model';
import { RootState } from '../../ core/store/store';
import { getMatchBoardTiles, getNextShip } from './home-board.utils';

type PlacementMode = 'vertical' | 'horizontal';

export interface Ship {
  id: string;
  size: number;
  color: string;
  placed?: boolean;
  coords: Coordinate[];
}

interface HomeState {
  player?: PlayerId;
  tiles: HomeBoardTile[];
  ships: Ship[];
  selectedShipId?: string;
  placementMode: PlacementMode;
}

const DEFAULT_SHIPS = [
  { id: 'Carrier', size: 5, color: '#be456e', coords: [] },
  { id: 'Battleship', size: 4, color: '#0494ff', coords: [] },
  { id: 'Cruiser1', size: 3, color: '#04ff8a', coords: [] },
  { id: 'Cruiser2', size: 3, color: '#04ff8a', coords: [] },
  { id: 'Submarine1', size: 3, color: '#04ffde', coords: [] },
  { id: 'Submarine2', size: 3, color: '#04ffde', coords: [] },
  { id: 'Destroyer', size: 2, color: '#af54a0', coords: [] }
];

const initialState: HomeState = {
  tiles: initTiles<HomeBoardTile>(),
  ships: DEFAULT_SHIPS,
  placementMode: 'horizontal',
  selectedShipId: getNextShip(undefined, DEFAULT_SHIPS)?.id
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    restoreDefaultState: state => (state = { ...initialState }),
    setSelectedShip: (state, { payload: shipId }: PayloadAction<string>) => {
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
    clearShipSelection: state => (state.selectedShipId = undefined),
    markHover: (state, { payload: hoverTile }: PayloadAction<HomeBoardTile>) => {
      const selectedShip = state.ships.find(s => s.id === state.selectedShipId);
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
    tryToPlaceShip: (state, { payload: startBoardTile }: PayloadAction<HomeBoardTile>) => {
      const selectedShip = state.ships.find(s => s.id === state.selectedShipId);
      if (!selectedShip) {
        return;
      }
      const matchTiles = getMatchBoardTiles(selectedShip, startBoardTile, state.tiles, state.placementMode);
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
      state.ships = state.ships.map(ship => ({ ...ship, placed: false, zones: [] }));
      state.tiles = state.tiles.map(tile => ({ ...tile, shipId: undefined, color: undefined, hoverColor: undefined }));
      state.selectedShipId = getNextShip(undefined, state.ships)?.id;
    },
    togglePlacementMode: state => {
      state.placementMode = state.placementMode === 'horizontal' ? 'vertical' : 'horizontal';
    },
    setPlayer: (state, { payload: playerId }: PayloadAction<PlayerId>) => {
      state.player = playerId;
    },
    setTiles: (state, { payload: tiles }: PayloadAction<HomeTile[]>) => {
      if (tiles.length === initialState.tiles.length) {
        state.tiles = tiles.map(tile => {
          const ship = state.ships.find(s => s.id === tile.shipId);
          if (ship) {
            ship.placed = true;
          }
          const destroyed = tiles.filter(tile => tile.shipId === ship?.id && tile.hitted).length === ship?.size;
          return {
            ...tile,
            color: destroyed ? '#101010' : tile.hitted ? (ship ? darker(ship?.color) : '#828282') : ship?.color || '#e6e2f1'
          } as HomeBoardTile;
        });
      }
    }
  }
});

const darker = (color: string) => color + '55';

export const {
  setSelectedShip,
  markHover,
  unmarkHover,
  tryToPlaceShip,
  reset,
  togglePlacementMode,
  setPlayer: setHomePlayer,
  setTiles: setHomeTiles,
  clearShipSelection,
  restoreDefaultState
} = homeSlice.actions;

export const selectShips = (state: RootState) => state.home.ships;
export const selectShipsToPlace = (state: RootState) => state.home.ships.filter(ship => !ship.placed);
export const selectSelectedShip = (state: RootState) => state.home.ships.find(s => s.id === state.home.selectedShipId);
export const selectHomeTiles = (state: RootState) => state.home.tiles;
export const selectPlacementMode = (state: RootState) => state.home.placementMode;
export const selectHomePlayer = (state: RootState) => state.home.player;
export const selectIsHomeBoardCompleted = (state: RootState) => state.home.ships.filter(ship => !ship.placed).length === 0;
