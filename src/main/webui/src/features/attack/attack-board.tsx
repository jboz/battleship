import { BoardComponent } from '../../app/components/board';
import { AttackBoardTile } from '../../app/components/utils';
import { useDispatch, useSelector } from '../../app/store/hooks';
import './attack-board.scss';
import { hit, selectAttackTiles } from './attack.slice';

export const AttackBoard = () => {
  const dispatch = useDispatch();
  const tiles = useSelector(selectAttackTiles);

  const onTileClick = (tile: AttackBoardTile) => {
    dispatch(hit(tile.coord));
  };

  return (
    <div className="container">
      <h1>Attack Board</h1>

      <div className="boardContainer">
        <BoardComponent tiles={tiles} onClick={onTileClick} />
      </div>
    </div>
  );
};
