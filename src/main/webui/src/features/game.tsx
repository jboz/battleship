import { useState } from 'react';
import { useDispatch, useSelector } from '../app/store/hooks';
import { AttackBoard } from './attack/attack-board';
import './game.scss';
import { create, join, selectGameStatus } from './game.slice';
import { HomeBoard } from './home/home-board';
import { selectHomeTiles } from './home/home.slice';

function Game() {
  const dispatch = useDispatch();

  const homeTiles = useSelector(selectHomeTiles);
  const gameStatus = useSelector(selectGameStatus);

  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const createGame = () => dispatch(create({ player: playerName, board: { tiles: homeTiles } }));
  const joinGame = () => dispatch(join({ player: playerName, board: { tiles: homeTiles }, gameCode }));

  return (
    <div className="container">
      <HomeBoard />
      {(!gameStatus || gameStatus === 'CREATION') && (
        <div className="toolbar">
          <div>
            <input
              id="playerNameCreation"
              placeholder="Player name..."
              value={playerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
            />
            <button onClick={createGame}>Create</button>
          </div>
          <div>
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
            <button onClick={joinGame}>Connect</button>
          </div>
        </div>
      )}
      <AttackBoard />
    </div>
  );
}

export default Game;
