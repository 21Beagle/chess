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
    const FENTest = "B6b/8/8/8/8/8/8/b6B w KQkq - 0 1";

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

            let availableMoves = showAvailableMoves(squareIndex);
            pushAvailableMovesToSquares(availableMoves);

            return;
        } else {
            unselectAll();
            hideAvailableMovesAll();
            return;
        }
    }

    function playerColorOpposite(playerColor = turnColor) {
        return playerColor === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
    }

    function showScopeOfAllMoves(board, playerColor = turnColor) {
        let availableMoves = [];
        let newBoard = [...board];
        for (let i = 0; i < board.length; i++) {
            if (newBoard[i].color === playerColor) {
                let squareAvailableMoves = showScopeForPiece(board, i);
                squareAvailableMoves.map((value) => {
                    availableMoves.push(value);
                });
            }
        }
        return availableMoves;
    }

    function checkForChecks(board, playerColor = turnColor) {
        let newBoard = [...board];
        let availableMoves = showScopeOfAllMoves(board, playerColor);
        let checks = availableMoves.map((value) => {
            return (
                newBoard[value].piece === PIECES.KING &&
                playerColor !== newBoard[value].color
            );
        });
        let anyChecks = checks.some((value) => {
            return value === true;
        });
        console.log(anyChecks);
        return anyChecks;
    }

    function togglePlayerTurn() {
        turnColor === COLOR.WHITE
            ? setTurnColor(COLOR.BLACK)
            : setTurnColor(COLOR.WHITE);
    }

    function handleMove(oldPosition, newPosition) {
        let newBoard = board;

        newBoard[newPosition] = { ...board[oldPosition] };
        newBoard[oldPosition] = { ...EMPTY_SQUARE };

        setBoard([...newBoard]);
    }

    function tryMove(oldPosition, newPosition, board) {
        let newBoard = [...board];

        newBoard[newPosition] = { ...board[oldPosition] };
        newBoard[oldPosition] = { ...EMPTY_SQUARE };

        return newBoard;
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

    function clearSquare(position) {
        let newBoard = board;

        newBoard[position] = { ...EMPTY_SQUARE };

        setBoard([...newBoard]);
    }

    function checkEnPassant(oldPosition, newPosition) {
        if (newPosition === enPassant) {
            clearSquare(newPosition + 8);
            clearSquare(newPosition - 8);
        }
        removeEnPassant();
        let newBoard = board;
        let oldPiece = board[oldPosition].piece;
        let newEnPassant = -1;
        if (oldPiece === PIECES.PAWN && oldPosition - newPosition === 16) {
            newEnPassant = oldPosition - 8;
        }
        if (oldPiece === PIECES.PAWN && oldPosition - newPosition === -16) {
            newEnPassant = oldPosition + 8;
        }
        if (newEnPassant !== -1) {
            newBoard[newEnPassant].enPassantAvailable = true;
        }
        setBoard([...newBoard]);
        setEnPassant(newEnPassant);
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

    function showScopeForPiece(board, position) {
        let newBoard = [...board];
        let square = newBoard[position];
        let availableMoves = [];
        switch (square.piece) {
            case PIECES.ROOK:
                availableMoves = availableRookMoves(position, newBoard);
                break;
            case PIECES.KNIGHT:
                availableMoves = availableKnightMoves(position, newBoard);
                break;
            case PIECES.BISHOP:
                availableMoves = availableBishopMoves(position, newBoard);
                break;
            case PIECES.QUEEN:
                availableMoves = availableQueenMoves(position, newBoard);
                break;
            case PIECES.KING:
                availableMoves = availableKingMoves(position, newBoard);
                break;
            case PIECES.PAWN:
                availableMoves = availablePawnMoves(
                    position,
                    newBoard,
                    enPassant
                );
                break;
            default:
                break;
        }

        availableMoves = availableMoves.filter((value) => {
            return value < 64 && value >= 0;
        });

        return availableMoves;
    }

    function showAvailableMoves(position) {
        let square = board[position];
        let availableMoves = [];
        switch (square.piece) {
            case PIECES.ROOK:
                availableMoves = availableRookMoves(position, board);
                break;
            case PIECES.KNIGHT:
                availableMoves = availableKnightMoves(position, board);
                break;
            case PIECES.BISHOP:
                availableMoves = availableBishopMoves(position, board);
                break;
            case PIECES.QUEEN:
                availableMoves = availableQueenMoves(position, board);
                break;
            case PIECES.KING:
                availableMoves = availableKingMoves(position, board);
                break;
            case PIECES.PAWN:
                availableMoves = availablePawnMoves(position, board, enPassant);
                break;
            default:
                break;
        }

        availableMoves = availableMoves.filter((value) => {
            return value < 64 && value >= 0;
        });
        availableMoves = availableMoves.filter((value) => {
            let testBoard = tryMove(position, value, board);

            console.log(
                value,
                !checkForChecks(testBoard, playerColorOpposite(turnColor)),
                testBoard
            );

            return !checkForChecks(testBoard, playerColorOpposite(turnColor));
        });

        return availableMoves;
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
            <button
                onClick={() =>
                    checkForChecks(board, playerColorOpposite(turnColor))
                }
            >
                {"Is " + turnColor + " in check?"}
            </button>
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
