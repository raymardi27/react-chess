import { Chessboard as MyBoard } from 'react-chessboard';
import { useDispatch, useSelector } from 'react-redux';
import { attemptMove } from '../slices/gameSlice';
import { type RootState } from '../store';

export default function Board() {
    const dispatch = useDispatch();
    const { status, color, fen, turn } = useSelector((s: RootState) => s.game);

    // Show board only after match starts
    const playing = status === "playing";
    const ended = status === "ended";
    if (!playing && !ended) return null;

    // Drag and Drop handler
    const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
        // Only allow on their turn
        if (!color || !turn) return false;
        const myTurn = (color === "white" && turn === "w") || color === "black" && turn === "b";
        if (!myTurn) return false;

        // Dispatch move
        dispatch(attemptMove({ from: sourceSquare, to: targetSquare, promotion: "q" }));
        return true; // Assume move is valid for now    
    };

    return (
        <div style={{ maxWidth: 560 }}>
            <MyBoard 
                position={fen}
                boardOrientation={color ?? "white"}
                arePiecesDraggable={playing}
                onPieceDrop={onDrop}
                animationDuration={200}
            />
        </div>
    );
}