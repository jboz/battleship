import knex from 'knex';
import path from 'path';
import { Game } from '../(core)/model';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve('games.db')
  }
});

if (!db.schema.hasTable('games')) {
  db.schema.createTable('games', table => {
    table.increments('id', {
      primaryKey: true
    });
    table.string('code').notNullable().unique();
    table.string('json').notNullable();
  });
}

interface GameEntity {
  id: string;
  lastUpdate: Date;
  code: string;
  json: string;
}

const selectGames = () => db<GameEntity>('games');
const mapGame = (game: GameEntity | undefined): Game => game && JSON.parse(game.json);
const selectGame = (code: string) => selectGames().where({ code });

export const games = () => selectGames().then(games => games.map(mapGame));

export const existingGameCodes = () =>
  selectGames()
    .select('code')
    .then(codes => codes.map(c => c.code));

export const insertGame = (game: Game) => {
  return selectGames()
    .insert({ code: game.id, lastUpdate: new Date(), json: JSON.stringify(game) })
    .then(() => game);
};

export const findById = (id: string) => selectGame(id).first().then(mapGame);

export const saveGame = (game: Game) =>
  selectGame(game.id)
    .update({
      lastUpdate: new Date(),
      json: JSON.stringify(game)
    })
    .then(() => game);
