import './board.scss';
import { BoardTile } from './utils';

interface BoardComponentProps<T> {
  tiles: T[];
  onClick: (tile: T) => void;
  onMouseEnter?: (tile: T) => any;
  onMouseOut?: (tiles: T) => any;
}

export const BoardComponent = <T extends BoardTile>({ onClick, onMouseEnter, onMouseOut, tiles }: BoardComponentProps<T>) => {
  return (
    <div className="boardContainerX">
      <div className="boardHeaderX">
        <div className="header"></div>
        <div className="header">A</div>
        <div className="header">B</div>
        <div className="header">C</div>
        <div className="header">D</div>
        <div className="header">E</div>
        <div className="header">F</div>
        <div className="header">G</div>
        <div className="header">H</div>
        <div className="header">I</div>
        <div className="header">J</div>
      </div>
      <div className="boardContainerY">
        <div className="boardHeaderY">
          <div className="header">1</div>
          <div className="header">2</div>
          <div className="header">3</div>
          <div className="header">4</div>
          <div className="header">5</div>
          <div className="header">6</div>
          <div className="header">7</div>
          <div className="header">8</div>
          <div className="header">9</div>
          <div className="header">10</div>
        </div>
        <div className="board">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className="cell"
              style={{ backgroundColor: tile.hoverColor || tile.color || '#e6e2f1' }}
              onClick={() => onClick(tile)}
              onMouseEnter={() => onMouseEnter && onMouseEnter(tile)}
              onMouseOut={() => onMouseOut && onMouseOut(tile)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
