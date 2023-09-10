import { Game } from '@/app/(core)/model';
import { existsSync, readFileSync, writeFileSync } from 'fs';

export const games = () => Promise.resolve(readFromFile());

export const findByCode = (code: string) => games().then(games => games.find(g => g.code === code));

export const existingGameCodes = () => games().then(games => games.map(g => g.code));

export const insertGame = (game: Game) =>
  games()
    .then(games => [...games, game])
    .then(saveToFile)
    .then(() => game);

export const updateGame = (game: Game) =>
  games()
    .then(games => [...games.filter(g => g.code !== game.code), game])
    .then(saveToFile)
    .then(() => game);

export const deleteGame = (game: Game) =>
  games()
    .then(games => [...games.filter(g => g.code !== game.code)])
    .then(saveToFile);

const GAMES_FILE = './games.json';

const readFromFile = () => {
  if (!existsSync(GAMES_FILE)) {
    saveToFile([]);
  }
  const json = readFileSync(GAMES_FILE, 'utf-8');
  return JSON.parse(json) as Game[];
};

const saveToFile = (games: Game[]) => writeFileSync(GAMES_FILE, JSON.stringify(games), 'utf-8');
