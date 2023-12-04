import { BoardComponent } from '../../app/components/board';
import { AttackBoardTile } from '../../app/components/utils';
import { useDispatch, useSelector } from '../../app/store/hooks';
import { selectAttackPlayerName } from '../game.slice';
import './attack-board.scss';
import { selectAttackBoardBloqued, selectAttackTiles, shot } from './attack.slice';

export const AttackBoard = () => {
  const dispatch = useDispatch();
  const tiles = useSelector(selectAttackTiles);
  const playerName = useSelector(selectAttackPlayerName);
  const bloqued = useSelector(selectAttackBoardBloqued);

  const onTileClick = (tile: AttackBoardTile) => {
    if (bloqued) {
      return;
    }
    dispatch(shot(tile.coord));
  };

  return (
    <div className="attack-board">
      <title>
        <h1>Attack Board</h1>
        {playerName && (
          <>
            <h2>{playerName}</h2>
          </>
        )}
      </title>

      <main>
        <BoardComponent tiles={tiles} onClick={onTileClick} />
        {!playerName && (
          <div className="overlay">
            <span>Wainting for player</span>
          </div>
        )}
        {bloqued && (
          <div className="overlay">
            <span>{playerName}'s turn</span>
          </div>
        )}
      </main>
    </div>
  );
};
