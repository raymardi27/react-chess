import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import {socketMiddleware} from "./socketMiddleware";

export const store = configureStore({
    reducer: {game: gameReducer},
    middleware: (gDM) => gDM().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;