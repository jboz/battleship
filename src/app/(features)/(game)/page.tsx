'use client';

import GameApi from '@/app/(core)/api.service';
import AttackBoard from '@/app/(core)/components/attackboard';
import HomeBoard from '@/app/(core)/components/homeboard';
import { BusPayload, Coordinates, PlayerId, Ship } from '@/app/(core)/model';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function Game() {
  const [started, setStarted] = useState<boolean>(false);

  const [ships, setShips] = useState<Ship[]>([
    { id: 1, name: 'Carrier', size: 5, color: '#be456e' },
    { id: 2, name: 'Battleship', size: 4, color: '#0494ff' },
    { id: 3, name: 'Cruiser', size: 3, color: '#04ff8a' },
    { id: 4, name: 'Cruiser', size: 3, color: '#04ff8a' },
    { id: 5, name: 'Submarine', size: 3, color: '#04ffde' },
    { id: 6, name: 'Submarine', size: 3, color: '#04ffde' },
    { id: 7, name: 'Destroyer', size: 2, color: '#af54a0' }
  ]);

  const [playerName, setPlayerName] = useState('');
  const [playerNameJoin, setPlayerNameJoin] = useState('');
  const [gameId, setGameId] = useState('');
  const [playerId, setPlayerId] = useState<PlayerId>();
  const [target, setTarget] = useState<PlayerId>();

  const [connection, setConnection] = useState<EventSource>();

  useEffect(() => {
    if (started && gameId && playerId) {
      setConnection(GameApi.connect(gameId, playerId));
    }
  }, [started, gameId, playerId]);

  useEffect(() => {
    if (connection) {
      connection.onmessage = event => {
        const data = event.data as BusPayload;
        console.log('data', data);
      };
    }
  }, [connection]);

  const start = () => setStarted(true);

  const createOnline = () =>
    GameApi.create(playerName)
      .then(game => setGameId(game.id))
      .then(() => setStarted(true))
      .then(() => setPlayerId('player1'))
      .then(() => setTarget('player2'));

  const joinGame = () =>
    GameApi.join(gameId, playerNameJoin)
      .then(game => setGameId(game.id))
      .then(() => setStarted(true))
      .then(() => setPlayerId('player2'))
      .then(() => setTarget('player1'));

  const hit = (coords: Coordinates) => target && GameApi.hit(gameId, target, coords);

  return (
    <div className={styles.container}>
      {started && gameId && (
        <aside>
          <h3>{gameId}</h3>
          {playerName && <h3>{playerName}</h3>}
          {playerNameJoin && <h3>{playerNameJoin}</h3>}
        </aside>
      )}
      <div className={styles.board}>
        <HomeBoard started={started} ships={ships} setShips={setShips} />
        {!started && ships.filter(s => !s.placed).length === 0 && (
          <div className={styles.actions}>
            <button onClick={start}>Start game</button>
            <div>
              <input
                type="text"
                placeholder="Player name"
                value={playerName}
                onChange={(e: React.FormEvent<HTMLInputElement>) => setPlayerName(e.currentTarget.value)}
              />
              <button onClick={createOnline} disabled={!playerName}>
                Create online game
              </button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Game code"
                value={gameId}
                onChange={(e: React.FormEvent<HTMLInputElement>) => setGameId(e.currentTarget.value)}
              />
              <input
                type="text"
                placeholder="Player name"
                value={playerNameJoin}
                onChange={(e: React.FormEvent<HTMLInputElement>) => setPlayerNameJoin(e.currentTarget.value)}
              />
              <button onClick={() => joinGame()} disabled={!gameId || !playerNameJoin}>
                Join a game
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.board}>
        {started && <AttackBoard onClick={hit} />}
        {started && <button onClick={() => setStarted(false)}>Restart game</button>}
      </div>
    </div>
  );
}
