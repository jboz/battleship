import { useDispatch, useSelector } from '../../app/store/hooks';
import { disconnect, selectGameCode } from '../game.slice';
import { ShotsLogComponent } from '../shots-log/shots-log.component';
import './settings.scss';

export const Settings = () => {
  const dispatch = useDispatch();
  const gameCode = useSelector(selectGameCode);
  return (
    <div className="settings">
      <h1>Settings</h1>
      <h3>{gameCode}</h3>
      <button onClick={() => dispatch(disconnect())}>Disconnect</button>
      <ShotsLogComponent />
    </div>
  );
};
