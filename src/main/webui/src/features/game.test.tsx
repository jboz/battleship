import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../ core/store/store';
import Game from './game';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Game />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
