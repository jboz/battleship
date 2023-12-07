import { coordToString } from '../../app/components/utils';
import { useSelector } from '../../app/store/hooks';
import './shots-log.scss';
import { selectLogs } from './shots-log.slice';

export const ShotsLogComponent = () => {
  const logs = useSelector(selectLogs);

  return (
    <div className="shots-log">
      {logs.length > 0 && (
        <>
          <h3>log:</h3>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>{coordToString(log.coord)}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
