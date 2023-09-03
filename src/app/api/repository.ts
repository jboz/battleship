import { Game } from '../(core)/model';

let db: Game[] = [];

export const games = () => [...db];

export const findById = (id: string) => Promise.resolve(db.find(g => g.id === id));

export const existingGameCodes = () => Promise.resolve(db.map(g => g.id));

export const insertGame = (game: Game) => {
  db.push(game);
  return Promise.resolve(game);
};

export const saveGame = (game: Game) => {
  db = [...db.filter(g => g.id === game.id), game];
  return Promise.resolve(game);
};
