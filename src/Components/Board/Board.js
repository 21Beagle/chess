import React, { useState } from "react";
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
    const [enPassant, setEnPassant] = useState(-1);

    function handleClick(squareIndex) {
        if (board[squareIndex].selected === true) {
            unselectAll();
            hideAvailableMovesAll();
            return;
        } else if (board[squareIndex].availableMove === true) {
            checkEnPassant(selectedSquare, squareIndex);
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
        let newBoard = board;
        checkEnPassant(oldPosition, newPosition);

        newBoard[newPosition] = { ...board[oldPosition] };
        newBoard[oldPosition] = { ...EMPTY_SQUARE };

        setBoard([...newBoard]);
    }

    function removeEnPassant() {
        let newBoard = [];

        for (let i in board) {
            newBoard[i] = board[i];
            newBoard[i].enPassantAvailable = false;
        }

        setBoard([...newBoard]);
        return;
    }

    function checkEnPassant(oldPosition, newPosition) {
        removeEnPassant();
        let newBoard = board;
        let oldPiece = board[oldPosition].piece;
        let enPassant = -1;
        if (oldPiece === PIECES.PAWN && oldPosition - newPosition === 16) {
            enPassant = oldPosition - 8;
        }
        if (oldPiece === PIECES.PAWN && oldPosition - newPosition === -16) {
            enPassant = oldPosition + 8;
        }
        if (enPassant !== -1) {
            newBoard[enPassant].enPassantAvailable = true;
        }
        setBoard([...newBoard]);
        setEnPassant(enPassant);
    }

    function selectSquare(square) {
        let newBoard = [];
        newBoard = board;
        newBoard[square] = { ...board[square], selected: true };
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
                availableMoves = availablePawnMoves(position, board, enPassant);
                break;
            default:
                break;
        }
        availableMoves = availableMoves.filter((value) => {
            return value < 64 && value > 0;
        });
        pushAvailableMovesToSquares(availableMoves);
    }

    function pushAvailableMovesToSquares(availableMoves) {
        let newSquares = board;

        for (let i in availableMoves) {
            let availableMoveIndex = availableMoves[i];
            newSquares[availableMoveIndex] = {
                ...board[availableMoveIndex],
                availableMove: true,
            };
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
                        enPassantAvailable={square.enPassantAvailable}
                        selected={square.selected}
                    />
                ))}
            </div>
        </div>
    );
}

export default Board;
