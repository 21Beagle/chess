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
    availablePawnMoves,
} from "../../Util/AvailableMoves";
import { COLOR, EMPTY_SQUARE, PIECES } from "../../Consts/Consts";

function Board() {
    const FENstart = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const [board, setBoard] = useState(FENToBoard(FENstart).board);
    const [turnColor, setTurnColor] = useState(COLOR.WHITE);
    const [selectedSquare, setSelectedSquare] = useState(-1);

    function handleClick(squareIndex) {
        if (board[squareIndex].selected === true) {
            unselectAll();
            hideAvailableMovesAll();
            return;
        } else if (board[squareIndex].availableMove === true) {
            handleMove(selectedSquare, squareIndex);
            unselectAll();
            togglePlayerTurn();
            hideAvailableMovesAll();
            return;
        }
        if (board[squareIndex].color === turnColor) {
            unselectAll();
            selectSquare(squareIndex);
            setSelectedSquare(squareIndex);
            hideAvailableMovesAll();
            showAvailableMoves(squareIndex);
            return;
        } else {
            unselectAll();
            hideAvailableMovesAll();
            return;
        }
    }

    function togglePlayerTurn() {
        turnColor === COLOR.WHITE
            ? setTurnColor(COLOR.BLACK)
            : setTurnColor(COLOR.WHITE);
    }

    function handleMove(oldPosition, newPosition) {
        let newSquares = board;
        newSquares[newPosition] = { ...board[oldPosition] };
        newSquares[oldPosition] = { ...EMPTY_SQUARE };
        setBoard([...newSquares]);
    }

    function selectSquare(square) {
        let newSquares = [];
        newSquares = board;
        newSquares[square] = { ...board[square], selected: true };
        return;
    }

    function unselectAll() {
        let newSquares = [];

        for (let i in board) {
            newSquares[i] = board[i];
            newSquares[i].selected = false;
        }
        setSelectedSquare(-1);

        setBoard([...newSquares]);
        return;
    }

    function showAvailableMoves(position) {
        let square = board[position];
        let availableMoves = [];
        switch (square.piece) {
            case PIECES.ROOK:
                availableMoves = availableRookMoves(position);
                break;
            case PIECES.KNIGHT:
                availableMoves = availableKnightMoves(position);
                break;
            case PIECES.BISHOP:
                availableMoves = availableBishopMoves(position);
                break;
            case PIECES.QUEEN:
                availableMoves = availableQueenMoves(position);
                break;
            case PIECES.KING:
                availableMoves = availableKingMoves(position);
                break;
            case PIECES.PAWN:
                availableMoves = availablePawnMoves(position, square.color);
                break;
            default:
                break;
        }
        pushAvailableMovesToSquares(availableMoves);
    }

    function pushAvailableMovesToSquares(availableMoves) {
        let newSquares = board;
        for (let i in availableMoves) {
            let index = availableMoves[i];
            if (index >= 0 && index <= 63) {
                newSquares[index] = {
                    ...board[index],
                    availableMove: true,
                };
            }
        }
        setBoard([...newSquares]);
    }

    function hideAvailableMovesAll() {
        let newSquares = board;
        for (let i in board) {
            newSquares[i].availableMove = false;
        }
        setBoard([...newSquares]);
    }

    return (
        <div className="center">
            <div className="board-wrapper center">
                {board.map((square, value) => (
                    <Square
                        key={value}
                        piece={square.piece}
                        pieceColor={square.color}
                        id={value}
                        handleClick={(square) => handleClick(square)}
                        availableMove={square.availableMove}
                        selected={square.selected}
                    />
                ))}
            </div>
        </div>
    );
}

export default Board;
