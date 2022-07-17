import React, { useState, useEffect } from "react";
import "./Board.css";
import Square from "../Square/Square";

import FENToBoard from "../../Util/FEN";
// import { coordinates } from "../../Util/cartesianToArray";
import {
    availableBishopMoves,
    availableKingMoves,
    availableKnightMoves,
    availableQueenMoves,
    availableRookMoves,
} from "../../Util/AvailableMoves";

function Board() {
    const defaultPiece = { piece: "", color: "" };
    const FENstart =
        "rnbqkbnr/pppppppp/8/3B4/K2K4/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const [squares, setSquares] = useState(Array(64).fill(defaultPiece));

    useEffect(() => {
        setSquares(FENToBoard(FENstart).board);
    }, []);

    function showAvailableMoves(position) {
        console.log(position);
        let piece = squares[position];
        console.log(piece);
        let availableMoves = [];

        switch (piece.piece) {
            case "R":
                availableMoves = availableRookMoves(position);
                break;
            case "N":
                availableMoves = availableKnightMoves(position);
                break;
            case "B":
                availableMoves = availableBishopMoves(position);
                break;
            case "Q":
                availableMoves = availableQueenMoves(position);
                break;
            case "K":
                availableMoves = availableKingMoves(position);
                break;
            default:
                break;
        }
        pushAvailableMovesToSquares(availableMoves);
    }

    console.log(squares);

    function pushAvailableMovesToSquares(availableMoves) {
        let newSquares = [];
        for (let i in squares) {
            newSquares[i] = { ...squares[i], availableMove: false };
        }
        for (let i in availableMoves) {
            let index = availableMoves[i];
            if (index >= 0 && index <= 63) {
                newSquares[index] = {
                    ...squares[index],
                    availableMove: true,
                };
            }
        }
        setSquares(newSquares);
    }

    return (
        <div className="center">
            <div className="board-wrapper center">
                {squares.map((square, value) => (
                    <Square
                        key={value}
                        piece={square.piece}
                        pieceColor={square.color}
                        id={value}
                        handleClick={(moves) => showAvailableMoves(moves)}
                        availableMove={square.availableMove}
                    />
                ))}
            </div>
        </div>
    );
}

export default Board;
