import { Coordinates, Game, PlayerId, Zone } from '@/app/(core)/model';
import { sendEvent } from './events.service';
import { updateGame } from './games.repository';

export const hit = (game: Game, hit: Coordinates, targetId: PlayerId) => {
  const target = getPlayer(game, targetId);
  const source = getPlayer(game, targetId === 'player2' ? 'player1' : 'player2');

  if (!getCoordinate(source.hits, hit)) {
    source.hits.push(hit);
  }
  source.hits = setZoneStatus(source.hits, target.board);
  target.board = setZoneStatus(target.board, source.hits);

  sendEvent(game.code, target.id, 'onBoardChange', { board: target.board });

  const newState = state(game);
  if (newState !== 'progress') {
    sendEvent(game.code, 'player1', 'onStateChange', { state: newState });
    sendEvent(game.code, 'player2', 'onStateChange', { state: newState });
  }
  game.state = newState;

  return updateGame(game).then(() => source.hits);
};

const state = (game: Game) => {
  if (game.player1.hits && game.player1.hits.map(h => !!h.touched).length === game.player1.board.length) {
    return 'player2Win';
  }
  if (game.player2?.hits && game.player2?.board && game.player2.hits.map(h => !!h.touched).length === game.player2.board.length) {
    return 'player1Win';
  }
  return game.state;
};

const getPlayer = (game: Game, playerId: PlayerId) => (playerId === 'player2' ? game.player2 : game.player1);

const setZoneStatus = (source: Coordinates[], target: Coordinates[]): Zone[] => {
  return source.map(hit => ({ ...hit, touched: !!getCoordinate(target, hit) }));
};

const getCoordinate = (coordinates: Coordinates[], coord: Coordinates) => coordinates.find(h => h.x === coord.x && h.y === coord.y);
