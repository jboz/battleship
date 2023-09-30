'use client';

import GameApi from '@/app/(core)/api.service';
import AttackBoard from '@/app/(core)/components/attackboard';
import HomeBoard from '@/app/(core)/components/homeboard';
import { Board, Coordinates, FinishEvent, GameState, HitEvent, Hits, PlayerEvent, PlayerId } from '@/app/(core)/model';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function Game() {
  const [playerName, setPlayerName] = useState('');
  const [playerNameJoin, setPlayerNameJoin] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [playerId, setPlayerId] = useState<PlayerId>();
  const [target, setTarget] = useState<PlayerId>();
  const [gameState, setGameState] = useState<GameState>('creation');

  const [board, setBoard] = useState<Board>({
    ships: [
      { name: 'Carrier', size: 5, color: '#be456e' },
      { name: 'Battleship', size: 4, color: '#0494ff' },
      { name: 'Cruiser1', size: 3, color: '#04ff8a' },
      { name: 'Cruiser2', size: 3, color: '#04ff8a' },
      { name: 'Submarine1', size: 3, color: '#04ffde' },
      { name: 'Submarine2', size: 3, color: '#04ffde' },
      { name: 'Destroyer', size: 2, color: '#af54a0' }
    ]
  });

  const [hits, setHits] = useState<Hits>({ zones: [] });
  const [targetHits, setTargetHits] = useState<Hits>({ zones: [] });

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
      connection.addEventListener('PlayerEvent', event => {
        const content = JSON.parse(event.data) as PlayerEvent;
        setBoard(content.player.board);
        setHits(content.player.hits);
      });
      connection.addEventListener('HitEvent', event => {
        const content = JSON.parse(event.data) as HitEvent;
        if (content.player === target) {
          setTargetHits(content.hits);
        }
      });
      connection.addEventListener('FinishEvent', event => {
        const content = JSON.parse(event.data) as FinishEvent;
      });
      connection.onerror = () => setError('Connection error');

      return () => connection.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  const start = () => setGameState('progress');

  const createOnline = () =>
    GameApi.create(playerName, board).then(game => {
      if (game.code) {
        setGameCode(game.code);
        start();
        setPlayerId('player1');
        setTarget('player2');
      }
    });

  const joinGame = () =>
    GameApi.join(gameCode, playerNameJoin, board)
      .then(game => {
        if (game.code) {
          setGameCode(game.code);
          start();
          setPlayerId('player2');
          setTarget('player1');
        }
      })
      .then(start);

  const reconnect = () =>
    GameApi.getPlayer(gameCode, playerNameJoin)
      .then(player => {
        start();
        setPlayerId(player.id);
        setTarget(player.id === 'player2' ? 'player1' : 'player2');
        setBoard(player.board);
        setHits(player.hits);
      })
      .then(start);

  const hit = (coords: Coordinates) => target && GameApi.hit(gameCode, target, coords);

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
        <HomeBoard started={gameState === 'progress'} ships={board.ships} setShips={ships => setBoard({ ships })} targetHits={targetHits} />
        <div className={styles.actions}>
          {gameState === 'creation' && (
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
              <button onClick={() => reconnect()} disabled={!gameCode || !playerNameJoin}>
                Reconnect
              </button>
            </div>
          )}
          {gameState === 'creation' && board.ships.filter(s => !s.placed).length === 0 && (
            <>
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
            </>
          )}
        </div>
      </div>
      <div className={styles.board}>
        {gameState === 'progress' && <AttackBoard onClick={hit} hits={hits} />}
        {gameState === 'progress' && <button onClick={() => setGameState('creation')}>Restart game</button>}
      </div>
    </div>
  );
}
