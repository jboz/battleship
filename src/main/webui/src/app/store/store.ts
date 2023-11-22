import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { attackSlice } from '../../features/attack/attack.slice';
import { gameSlice } from '../../features/game.slice';
import { homeSlice } from '../../features/home/home.slice';
import { errorsSlice } from '../errors/errors.slice';

export const store = configureStore({
  reducer: {
    home: homeSlice.reducer,
    attack: attackSlice.reducer,
    game: gameSlice.reducer,
    errors: errorsSlice.reducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
