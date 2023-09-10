'use client';

import GameApi from '@/app/(core)/api.service';
import AttackBoard from '@/app/(core)/components/attackboard';
import HomeBoard from '@/app/(core)/components/homeboard';
import { Coordinates, EventPayload, GameState, OnConnectEvent, OnStateChangeEvent, PlayerId, Ship, Zone } from '@/app/(core)/model';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function Game() {
  const [ships, setShips] = useState<Ship[]>([
    { id: 1, name: 'Carrier', size: 5, color: '#be456e', coords: [] },
    { id: 2, name: 'Battleship', size: 4, color: '#0494ff', coords: [] },
    { id: 3, name: 'Cruiser', size: 3, color: '#04ff8a', coords: [] },
    { id: 4, name: 'Cruiser', size: 3, color: '#04ff8a', coords: [] },
    { id: 5, name: 'Submarine', size: 3, color: '#04ffde', coords: [] },
    { id: 6, name: 'Submarine', size: 3, color: '#04ffde', coords: [] },
    { id: 7, name: 'Destroyer', size: 2, color: '#af54a0', coords: [] }
  ]);

  const [playerName, setPlayerName] = useState('');
  const [playerNameJoin, setPlayerNameJoin] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [playerId, setPlayerId] = useState<PlayerId>();
  const [target, setTarget] = useState<PlayerId>();
  const [gameState, setGameState] = useState<GameState>('creation');

  const [board, setBoard] = useState<Zone[]>([]);
  const [hits, setHits] = useState<Zone[]>([]);

  const [connection, setConnection] = useState<EventSource>();

  const [error, setError] = useState<string>();

  useEffect(() => {
    if (gameState === 'creation') {
      setConnection(undefined);
    } else {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, gameCode, playerId]);

  const connect = () => gameState === 'progress' && gameCode && playerId && setConnection(GameApi.connect(gameCode, playerId));

  useEffect(() => {
    if (connection) {
      connection.onmessage = event => {
        const payload = event.data as EventPayload;
        if (payload.type === 'onBoardChange') {
          const content = payload.content as OnConnectEvent;
          setBoard(content.board);
        }
        if (payload.type === 'onStateChange') {
          const content = payload.content as OnStateChangeEvent;
          setGameState(content.state);
        }
      };
      connection.onerror = event => setError('connection error');
    }
  }, [connection]);

  const start = () => setGameState('progress');

  const getBoard = () => ships.map(s => s.coords).reduce((arr, accu) => [...arr, ...accu], []);

  const createOnline = () =>
    GameApi.create(playerName, getBoard()).then(game => {
      if (game.code) {
        setGameCode(game.code);
        start();
        setPlayerId('player1');
        setTarget('player2');
      }
    });

  const joinGame = () =>
    GameApi.join(gameCode, playerNameJoin, getBoard())
      .then(game => {
        if (game.code) {
          setGameCode(game.code);
          start();
          setPlayerId('player2');
          setTarget('player1');
        }
      })
      .then(start);

  const hit = (coords: Coordinates) => target && GameApi.hit(gameCode, target, coords).then(hits => setHits(hits));

  return (
    <div className={styles.container}>
      {gameState === 'progress' && gameCode && (
        <aside>
          <h3>{gameCode}</h3>
          {playerName && <h3>{playerName}</h3>}
          {playerNameJoin && <h3>{playerNameJoin}</h3>}
          {error && (
            <>
              <h3>{error}</h3>
              <button onClick={connect}>Reconnect</button>
            </>
          )}
        </aside>
      )}
      <div className={styles.board}>
        <HomeBoard started={gameState === 'progress'} ships={ships} setShips={setShips} board={board} />
        {gameState === 'creation' && ships.filter(s => !s.placed).length === 0 && (
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
                value={gameCode}
                onChange={(e: React.FormEvent<HTMLInputElement>) => setGameCode(e.currentTarget.value)}
              />
              <input
                type="text"
                placeholder="Player name"
                value={playerNameJoin}
                onChange={(e: React.FormEvent<HTMLInputElement>) => setPlayerNameJoin(e.currentTarget.value)}
              />
              <button onClick={() => joinGame()} disabled={!gameCode || !playerNameJoin}>
                Join a game
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.board}>
        {gameState === 'progress' && <AttackBoard onClick={hit} hits={hits} />}
        {gameState === 'progress' && <button onClick={() => setGameState('creation')}>Restart game</button>}
      </div>
    </div>
  );
}
