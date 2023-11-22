import { useDispatch } from 'react-redux';
import { BoardComponent } from '../../app/components/board';
import { HomeBoardTile } from '../../app/components/utils';
import { useSelector } from '../../app/store/hooks';
import { useHotkeys } from '../../app/use-hotkeys';
import { selectGameConnected, selectHomePlayerName } from '../game.slice';
import './home-board.scss';
import {
  markHover,
  reset,
  selectHomeTiles,
  selectPlacementMode,
  selectSelectedShip,
  selectShips,
  setSelectedShip,
  togglePlacementMode,
  tryToPlaceShip,
  unmarkHover
} from './home.slice';

export const HomeBoard = () => {
  const dispatch = useDispatch();

  const placementMode = useSelector(selectPlacementMode);
  const ships = useSelector(selectShips);
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
            <span>-</span>
            <h1>{playerName}</h1>
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
        {!connected && (
          <ul>
            {ships
              .filter(s => !s.placed)
              .map((ship, index) => (
                <li key={index} className="ship" onClick={() => dispatch(setSelectedShip(ship.id))}>
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
