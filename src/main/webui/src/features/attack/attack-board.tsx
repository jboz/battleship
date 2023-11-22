import { BoardComponent } from '../../app/components/board';
import { AttackBoardTile } from '../../app/components/utils';
import { useDispatch, useSelector } from '../../app/store/hooks';
import { selectAttackPlayerName } from '../game.slice';
import './attack-board.scss';
import { selectAttackTiles, shot } from './attack.slice';

export const AttackBoard = () => {
  const dispatch = useDispatch();
  const tiles = useSelector(selectAttackTiles);
  const playerName = useSelector(selectAttackPlayerName);

  const onTileClick = (tile: AttackBoardTile) => {
    dispatch(shot(tile.coord));
  };

  return (
    <div className="container">
      <div className="title">
        <h1>Attack Board</h1>
        {playerName && (
          <>
            <span>-</span>
            <h1>{playerName}</h1>
          </>
        )}
      </div>

      <div className="boardContainer">
        <BoardComponent tiles={tiles} onClick={onTileClick} />
      </div>
    </div>
  );
};
