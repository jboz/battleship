import { useState } from 'react';
import { BoardComponent } from '../../app/components/board';
import { AttackBoardTile } from '../../app/components/utils';
import { useAppSelector } from '../../app/store/hooks';
import './attack-board.scss';
import { selectAttackTiles } from './attack.slice';

export const AttackBoard = () => {
  const [tiles] = useState<AttackBoardTile[]>(JSON.parse(JSON.stringify(useAppSelector(selectAttackTiles))) as AttackBoardTile[]);

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
