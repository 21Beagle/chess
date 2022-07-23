import React, { useState, useEffect } from "react";
import "./Board.css";
import Square from "../Square/Square";
import FENToBoard from "../../Util/FEN";
// import { coordinates } from "../../Util/cartesianToArray";
import { playerColorOpposite } from "../../Util/tools";
import {
    availableBishopMoves,
    availableKingMoves,
    availableKnightMoves,
    availableQueenMoves,
    availableRookMoves,
    availablePawnMoves,
} from "../../Util/AvailableMoves";
import {
    CASTLE_AVAILABLE,
    COLOR,
    EMPTY_SQUARE,
    PIECES,
    CHECK,
    CASTLE_PERMA,
} from "../../Consts/Consts";

function Board() {
    const FENstart = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const FENTest = "k7/8/8/1P6/1p6/8/8/K7 w KQkq - 0 1";
    const FENTestWhiteLong = "r3k2r/p3p2p/8/1r6/8/8/P3P2P/R3K2R w KQkq - 0 1";

    const [board, setBoard] = useState(FENToBoard(FENTestWhiteLong).board);
    const [turnColor, setTurnColor] = useState(COLOR.WHITE);
    const [castlePerma, setCastlePerma] = useState(CASTLE_PERMA);
    const [whiteMoveScope, setWhiteMoveScopes] = useState([]);
    const [blackMoveScope, setBlackMoveScopes] = useState([]);
    const [castle, setCastle] = useState(checkForCastle(board));
    const [check, setCheck] = useState(CHECK);
    const [whiteAvailableMoves, setWhiteAvailableMoves] = useState([]);
    const [blackAvailableMoves, setBlackAvailableMoves] = useState([]);
    const [selectedSquare, setSelectedSquare] = useState(-1);
    const [enPassant, setEnPassant] = useState(-1);

    useEffect(() => {
        setScopeAll(board);
        updateCastle(board);

        populateAllMovesForPlayer(board, turnColor);
        isPlayerInCheck(board, playerColorOpposite(turnColor), true);
        // eslint-disable-next-line
    }, [turnColor]);

    useEffect(() => {}, [whiteAvailableMoves, blackAvailableMoves, turnColor]);

    function handleClick(squareIndex) {
        if (board[squareIndex].selected === true) {
            unselectAll();
            hideAvailableMovesAll();
            return;
        } else if (board[squareIndex].availableMove === true) {
            checkEnPassant(selectedSquare, squareIndex);
            handleMove(selectedSquare, squareIndex);
            togglePlayerTurn();
            unselectAll();
            hideAvailableMovesAll();
            return;
        }
        if (board[squareIndex].color === turnColor) {
            unselectAll();
            selectSquare(squareIndex);
            setSelectedSquare(squareIndex);
            hideAvailableMovesAll();

            let availableMoves = board[squareIndex].availableMoves;
            pushAvailableMovesToSquares(availableMoves);
            return;
        } else {
            unselectAll();
            hideAvailableMovesAll();
            return;
        }
    }

    function checkForCastle(board) {
        // white long
        let newCastle = CASTLE_AVAILABLE;

        let whiteLongCheck = blackMoveScope.map((value) => {
            return value === 59 || value === 58 || value === 57;
        });
        whiteLongCheck = whiteLongCheck.some((value) => {
            return value === true;
        });
        if (
            castlePerma.WHITE_LONG &&
            !board[57].piece &&
            !board[58].piece &&
            !board[59].piece &&
            !whiteLongCheck
        ) {
            newCastle = { ...newCastle, WHITE_LONG: true };
        }

        // white short
        let whiteShortCheck = blackMoveScope
            .map((value) => {
                return value === 61 || value === 62;
            })
            .some((value) => {
                return value === true;
            });
        if (
            castlePerma.WHITE_SHORT &&
            !board[61].piece &&
            !board[62].piece &&
            !whiteShortCheck
        ) {
            newCastle = { ...newCastle, WHITE_SHORT: true };
        }

        // black long
        let blackLongCheck = whiteMoveScope
            .map((value) => {
                return value === 1 || value === 2 || value === 3;
            })
            .some((value) => {
                return value === true;
            });
        if (
            castlePerma.BLACK_LONG &&
            !board[1].piece &&
            !board[2].piece &&
            !board[3].piece &&
            !blackLongCheck
        ) {
            newCastle = { ...newCastle, BLACK_LONG: true };
        }

        // black short
        let blackShortCheck = whiteMoveScope
            .map((value) => {
                return value === 5 || value === 6;
            })
            .some((value) => {
                return value === true;
            });
        if (
            castlePerma.BLACK_SHORT &&
            !board[5].piece &&
            !board[6].piece &&
            !blackShortCheck
        ) {
            newCastle = { ...newCastle, BLACK_SHORT: true };
        }

        return newCastle;
    }

    function updateCastle() {
        let newCastle = checkForCastle(board);
        setCastle({ ...newCastle });
    }

    function setCastleUnavailable(playerColor) {
        playerColor === COLOR.WHITE
            ? setCastlePerma({
                  ...castlePerma,
                  WHITE_LONG: false,
                  WHITE_SHORT: false,
              })
            : setCastlePerma({
                  ...castlePerma,
                  BLACK_LONG: false,
                  BLACK_SHORT: false,
              });
    }

    function handleWin(turnColor) {
        console.log(turnColor + " won");
    }

    function populateAllMovesForPlayer(board) {
        let availableMoves = [];
        let whiteAvailableMoves = [];
        let blackAvailableMoves = [];
        let newBoard = [...board];

        for (let i = 0; i < board.length; i++) {
            newBoard[i].availableMoves = [];

            if (newBoard[i].piece === "") continue;

            let squareAvailableMoves = getAvailableMoves(board, i);
            newBoard[i].availableMoves = [...squareAvailableMoves];

            squareAvailableMoves.map((value) => {
                return availableMoves.push(value);
            });

            if (newBoard[i].color === COLOR.WHITE) {
                squareAvailableMoves.map((value) => {
                    return whiteAvailableMoves.push(value);
                });
            }
            if (newBoard[i].color === COLOR.BLACK) {
                squareAvailableMoves.map((value) => {
                    return blackAvailableMoves.push(value);
                });
            }
        }

        setWhiteAvailableMoves([...whiteAvailableMoves]);
        setBlackAvailableMoves([...blackAvailableMoves]);
        setBoard([...newBoard]);
        return availableMoves;
    }

    function isPlayerInCheck(
        board,
        playerColor = turnColor,
        fakeBoard = false
    ) {
        let whiteScope = [...whiteMoveScope];
        let blackScope = [...blackMoveScope];
        if (fakeBoard) {
            [whiteScope, blackScope] = setScopeAll(board, true);
        }
        let newBoard = [...board];
        let checks = [];
        if (playerColor === COLOR.BLACK) {
            checks = whiteScope.map((value) => {
                let piece = newBoard[value];
                return (
                    piece.piece === PIECES.KING && piece.color === COLOR.BLACK
                );
            });
        } else {
            checks = blackScope.map((value) => {
                let piece = newBoard[value];
                return (
                    piece.piece === PIECES.KING && piece.color === COLOR.WHITE
                );
            });
        }

        let anyChecks = checks.some((value) => {
            return value === true;
        });
        if (!fakeBoard) {
            setCheck(CHECK);
            if (anyChecks) updateCheck(turnColor);
        }

        return anyChecks;
    }

    function setScopeAll(board, fakeBoard) {
        let blackScope = [];
        let whiteScope = [];
        for (let i in board) {
            i = parseInt(i);
            if (!board[i].piece) continue;
            if (board[i].color === COLOR.BLACK) {
                let moves = showScopeForPiece(board, i);
                moves.map((move) => {
                    blackScope.push(move);
                    return 0;
                });
            } else if (board[i].color === COLOR.WHITE) {
                let moves = showScopeForPiece(board, i);
                moves.map((move) => {
                    whiteScope.push(move);
                    return 0;
                });
            }
        }
        if (!fakeBoard) {
            setWhiteMoveScopes([...whiteScope]);
            setBlackMoveScopes([...blackScope]);
        }
        return [whiteScope, blackScope];
    }

    function updateCheck(playerColor) {
        playerColor === COLOR.WHITE
            ? setCheck({ ...check, WHITE: true })
            : setCheck({ ...check, BLACK: true });
        return;
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
        setCheck(CHECK);
        if (newBoard[newPosition].piece === PIECES.KING) {
            setCastleUnavailable(newBoard[newPosition].color);
        }

        handleCastleMove(oldPosition, newPosition, newBoard);

        setBoard([...newBoard]);
    }

    function handleCastleMove(oldPosition, newPosition, newBoard) {
        if (newBoard[newPosition].piece === PIECES.KING) {
            console.log("1 layer");
            console.log(oldPosition, newPosition);
            if (oldPosition === 60 && newPosition === 58) {
                console.log("castle white short");
                newBoard[59] = { ...newBoard[56] };

                newBoard[56] = { ...EMPTY_SQUARE };
            }
            if (oldPosition === 60 && newPosition === 62) {
                console.log("castle white long");

                newBoard[61] = { ...newBoard[63] };
                newBoard[63] = { ...EMPTY_SQUARE };
            }
            if (oldPosition === 4 && newPosition === 2) {
                console.log("castle black long");
                newBoard[3] = { ...newBoard[0] };

                newBoard[0] = { ...EMPTY_SQUARE };
            }
            if (oldPosition === 4 && newPosition === 6) {
                console.log("castle black short");
                newBoard[5] = { ...newBoard[7] };

                newBoard[7] = { ...EMPTY_SQUARE };
            }
        }
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
                availableMoves = availableKingMoves(position, newBoard, castle);
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

    function getAvailableMoves(board, position) {
        let scopeMoves = showScopeForPiece(board, position);
        let availableMoves = scopeMoves.filter((value) => {
            let dummyBoard = tryMove(position, value, board);
            let check = !isPlayerInCheck(
                dummyBoard,
                board[position].color,
                true
            );
            return check;
        });
        console.log("                  ");
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
                onClick={() => pushAvailableMovesToSquares(blackAvailableMoves)}
            >
                black
            </button>
            <button
                onClick={() => pushAvailableMovesToSquares(whiteAvailableMoves)}
            >
                white
            </button>
            <button onClick={() => hideAvailableMovesAll()}>hide</button>
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
            <div>{JSON.stringify(castlePerma)}</div>
            <div>{JSON.stringify(castle)}</div>

            <button onClick={() => console.log(availableRookMoves(36, board))}>
                rook
            </button>
        </div>
    );
}

export default Board;
