import { useWindowSize } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';
import { ErrorsComponent } from '../app/errors/errors.component';
import { useDispatch, useSelector } from '../app/store/hooks';
import { AttackBoard } from './attack/attack-board';
import './game.scss';
import { create, join, selectGameConnected } from './game.slice';
import { HomeBoard } from './home/home-board';
import { selectHomeTiles, selectIsHomeBoardCompleted } from './home/home.slice';
import { Settings } from './settings/settings';

function Game() {
  const dispatch = useDispatch();

  const homeTiles = useSelector(selectHomeTiles);
  const isHomeBoardCompleted = useSelector(selectIsHomeBoardCompleted);
  const connected = useSelector(selectGameConnected);

  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const createGame = () => dispatch(create({ player: playerName, board: { tiles: homeTiles } }));
  const joinGame = () => dispatch(join({ player: playerName, board: { tiles: homeTiles }, gameCode }));

  const size = useWindowSize();
  const [sideBarVisible, setSideBarVisible] = useState(true);
  const toggleSideBar = () => setSideBarVisible(!sideBarVisible);
  const [autoHide, setAutoHide] = useState(false);

  useEffect(() => {
    if (size.width && (size.width < 622 || (size.width > 845 && size.width < 1130))) {
      setAutoHide(true);
      setSideBarVisible(false);
    } else {
      setAutoHide(false);
      setSideBarVisible(true);
    }
  }, [size]);

  return (
    <div className="game">
      <main>
        <HomeBoard />
        {!connected && (
          <div className="toolbar">
            <input
              id="gameCode"
              placeholder="Game code..."
              value={gameCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGameCode(e.target.value)}
            />
            <input
              id="playerNameConnect"
              placeholder="Player name..."
              value={playerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
            />
            <div>
              <button onClick={joinGame} disabled={!playerName || !gameCode}>
                Connect
              </button>
              <span>or</span>
              <button onClick={createGame} disabled={!playerName || !isHomeBoardCompleted}>
                Create
              </button>
            </div>
            <ul>
              <li>Set only player name to create a new game and both to connect to an existing game</li>
              {!isHomeBoardCompleted && <li>Complete your board to create a new game</li>}
            </ul>
          </div>
        )}
        {connected && <AttackBoard />}
      </main>
      {connected && (
        <>
          <aside style={{ position: autoHide ? 'fixed' : 'initial' }}>
            {(sideBarVisible && <button onClick={toggleSideBar}>&gt;</button>) || <button onClick={toggleSideBar}>&lt;</button>}
            <div style={{ display: sideBarVisible ? 'block' : 'none' }}>
              <Settings />
            </div>
          </aside>
        </>
      )}
      <footer>
        <ErrorsComponent />
      </footer>
    </div>
  );
}

export default Game;
