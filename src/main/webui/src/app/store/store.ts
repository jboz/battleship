import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { attackReducer } from '../../features/attack/attack.slice';
import { gameReducer } from '../../features/game.slice';
import { homeReducer } from '../../features/home/home.slice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    attack: attackReducer,
    game: gameReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
