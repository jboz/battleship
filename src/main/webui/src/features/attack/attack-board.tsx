import { BoardComponent } from '../../app/components/board';
import { AttackBoardTile } from '../../app/components/utils';
import { useSelector } from '../../app/store/hooks';
import './attack-board.scss';
import { selectAttackTiles } from './attack.slice';

export const AttackBoard = () => {
  const tiles = useSelector(selectAttackTiles);

  const onTileClick = (cliquedTile: AttackBoardTile) => {};

  return (
    <div className="container">
      <h1>Attack Board</h1>

      <div className="boardContainer">
        <BoardComponent tiles={tiles} onClick={onTileClick} />
      </div>
    </div>
  );
};
