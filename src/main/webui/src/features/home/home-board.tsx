import { useDispatch } from 'react-redux';
import { HomeBoardTile } from '../../ core/components/board.utils';
import { BoardComponent } from '../../ core/components/board/board';
import { useSelector } from '../../ core/store/hooks';
import { useHotkeys } from '../../ core/use-hotkeys';
import { selectGameConnected, selectHomePlayerName } from '../game.slice';
import './home-board.scss';
import {
  markHover,
  reset,
  selectHomeTiles,
  selectPlacementMode,
  selectSelectedShip,
  selectShips,
  selectShipsToPlace,
  setSelectedShip,
  togglePlacementMode,
  tryToPlaceShip,
  unmarkHover
} from './home.slice';

export const HomeBoard = () => {
  const dispatch = useDispatch();

  const placementMode = useSelector(selectPlacementMode);
  const ships = useSelector(selectShips);
  const shipsToPlace = useSelector(selectShipsToPlace);
  const selectedShip = useSelector(selectSelectedShip);
  const tiles = useSelector(selectHomeTiles);
  const playerName = useSelector(selectHomePlayerName);
  const connected = useSelector(selectGameConnected);

  const onTileMouseEnter = (hoverTile: HomeBoardTile) => dispatch(markHover(hoverTile));

  const onTileMouseOut = () => dispatch(unmarkHover());

  const onTileClick = (tile: HomeBoardTile) => {
    if (connected) {
      return;
    }
    const ship = tile.shipId && ships.find(ship => ship.id === tile.shipId);
    if (ship) {
      dispatch(setSelectedShip(ship.id));
    } else if (selectedShip) {
      dispatch(tryToPlaceShip(tile));
    }
  };

  useHotkeys('v', () => dispatch(togglePlacementMode()));
  useHotkeys('h', () => dispatch(togglePlacementMode()));

  return (
    <div className="home-board">
      <title>
        <h1>Home Board</h1>
        {playerName && (
          <>
            <h2>{playerName}</h2>
          </>
        )}
      </title>

      {!connected && (
        <header>
          <div>
            <button onClick={() => dispatch(togglePlacementMode())}>Toggle mode</button>
            <div>{placementMode}</div>
          </div>
          <button onClick={() => dispatch(reset())}>Reset</button>
        </header>
      )}

      <main>
        <BoardComponent tiles={tiles} onClick={onTileClick} onMouseEnter={onTileMouseEnter} onMouseOut={onTileMouseOut} />
        {connected && <div className="overlay"></div>}
        {!connected && (
          <ul style={{ minWidth: (shipsToPlace.length > 0 && '170px') || '' }}>
            {ships.map((ship, index) => (
              <li key={index} className="ship" onClick={() => !ship.placed && dispatch(setSelectedShip(ship.id))}>
                {Array.from({ length: ship.size }).map((_, index) => (
                  <div
                    key={ship.id + index}
                    className="cell"
                    style={{
                      backgroundColor: !ship.placed ? ship.color : '#84808b',
                      borderColor: selectedShip?.id === ship.id ? '#e6e2f1' : '#272138'
                    }}
                  ></div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};
