// import React from "react";
import ReactDOM from 'react-dom/client';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store, type RootState} from "./store";
import {lookingForMatch, attemptMove} from "./slices/gameSlice";
import Board from './components/Board';

function App() {
  const dispatch = useDispatch();
  const {status, color, fen, turn, winner } = useSelector((state: RootState) => state.game);

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>
      <h1> Chess</h1>
      <p>Status: {status}</p>
      {color && <p>You are playing as: {color}</p>}
      {status === "idle" && (
        <button onClick={() => dispatch(lookingForMatch())}>Play Random Opponent</button>
      )}

      <p>FEN: {fen}</p>
      <p>Turn: {turn === "w"? "White" : turn === "b" ? "Black" : "-"}</p>

      <Board />

      {status === "playing" && (
        <div style={{ marginTop: 12 }}>
          <p>Try a move: </p>
          <button onClick={() => dispatch(attemptMove({ from: "e2", to: "e4" }))}>e2 to e4</button>
        </div>
      )}

      {status === "ended" && winner && <h3>Game Over. Winner: {winner}</h3>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}><App /></Provider>
);