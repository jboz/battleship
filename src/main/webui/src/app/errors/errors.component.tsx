import { useEffect } from 'react';
import { useDispatch, useSelector } from '../store/hooks';
import { JsonProblem } from './errors.model';
import './errors.scss';
import { clearErrors, selectErrors } from './errors.slice';

export const ErrorsComponent = () => {
  const dispatch = useDispatch();
  const errors = useSelector(selectErrors);

  const errorMessage = (error: JsonProblem | string) => {
    if (typeof error === 'string') {
      return error;
    }
    return error.detail || error.title;
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        dispatch(clearErrors());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, errors]);

  return (
    <div className="errors" style={{ opacity: errors.length > 0 ? 1 : 0 }}>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{errorMessage(error)}</li>
        ))}
      </ul>
      <button onClick={() => dispatch(clearErrors())}>X</button>
    </div>
  );
};
