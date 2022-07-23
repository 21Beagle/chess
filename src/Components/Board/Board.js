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
    const [castle, setCastle] = useState(CASTLE_AVAILABLE);
    const [check, setCheck] = useState(CHECK);
    const [totalMoves, setTotalMoves] = useState(20);
    const [allAvailableMoves, setAllAvailableMoves] = useState([]);
    const [whiteAvailableMoves, setWhiteAvailableMoves] = useState([]);
    const [whiteMoveScope, setWhiteMoveScopes] = useState([]);
    const [blackAvailableMoves, setBlackAvailableMoves] = useState([]);
    const [blackMoveScope, setBlackMoveScopes] = useState([]);
    const [notPlayerTurnMoves, setAllNotPlayerTurnMoves] = useState([]);
    const [selectedSquare, setSelectedSquare] = useState(-1);
    const [enPassant, setEnPassant] = useState(-1);

    useEffect(() => {
        console.log(
            whiteMoveScope.map((value) => {
                return board[value].piece;
            }),
            blackMoveScope.map((value) => {
                return board[value].piece;
            })
        );
    }, [whiteMoveScope, blackMoveScope]);

    useEffect(() => {
        setScopeAll(board);

        populateAllMovesForPlayer(board, turnColor);
        // checkForChecks(board, playerColorOpposite(turnColor), true);
        checkForCastle(board);

        // eslint-disable-next-line
    }, [turnColor]);

    useEffect(() => {
        checkForCastle(board);
    }, [whiteAvailableMoves, blackAvailableMoves, turnColor]);

    useEffect(() => {
        if (totalMoves === 0 && (check.BLACK || check.WHITE)) {
            handleWin(playerColorOpposite(turnColor));
        }
        // eslint-disable-next-line
    }, [totalMoves, check]);

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
        let newCastle = CASTLE_AVAILABLE;
        if (castlePerma.WHITE === false) {
            newCastle = { ...castle, WHITE_LONG: false, WHITE_SHORT: false };
        }
        if (castlePerma.BLACK === false) {
            newCastle = { ...castle, BLACK_LONG: false, BLACK_SHORT: false };
        }

        // white long
        let whiteLongCheck = blackAvailableMoves.map((value) => {
            return value === 59 || value === 58 || value === 57;
        });
        whiteLongCheck = whiteLongCheck.some((value) => {
            return value === true;
        });
        if (
            !board[57].piece &&
            !board[58].piece &&
            !board[59].piece &&
            !whiteLongCheck
        ) {
            newCastle = { ...castle, WHITE_LONG: true };
        }
        // // white short
        // let whiteShortCheck = blackAvailableMoves
        //     .map((value) => {
        //         return value === 61 || value === 62;
        //     })
        //     .some((value) => {
        //         return value === true;
        //     });
        // if (board[61].piece || board[62].piece || !whiteShortCheck) {
        //     newCastle = { ...castle, WHITE_SHORT: true };
        // }
        // // black long
        // let blackLongCheck = notPlayerTurnMoves
        //     .map((value) => {
        //         return value === 1 || value === 2 || value === 3;
        //     })
        //     .some((value) => {
        //         return value === true;
        //     });
        // if (
        //     board[1].piece ||
        //     board[2].piece ||
        //     board[3].piece ||
        //     !blackLongCheck
        // ) {
        //     newCastle = { ...castle, BLACK_LONG: false };
        // }
        // // black short
        // let blackShortCheck = notPlayerTurnMoves
        //     .map((value) => {
        //         return value === 5 || value === 6;
        //     })
        //     .some((value) => {
        //         return value === true;
        //     });
        // if (board[5].piece || board[6].piece || !blackShortCheck) {
        //     newCastle = { ...castle, BLACK_SHORT: false };
        // }
        setCastle({ ...newCastle });
        return castle;
    }

    function setCastleUnavailable(playerColor) {
        playerColor === COLOR.WHITE
            ? setCastlePerma({ ...castlePerma, WHITE: false })
            : setCastlePerma({ ...castlePerma, BLACK: false });
    }

    function handleWin(turnColor) {
        console.log(turnColor + " won");
    }

    function populateAllMovesForPlayer(board, playerColor) {
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

        setBoard([...newBoard]);
        setTotalMoves(availableMoves.length);
        setAllAvailableMoves(availableMoves);
        setWhiteAvailableMoves([...whiteAvailableMoves]);
        setBlackAvailableMoves([...blackAvailableMoves]);
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
                console.log(newBoard[value].piece);
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
        console.log(checks);

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
                    return;
                });
            } else if (board[i].color === COLOR.WHITE) {
                let moves = showScopeForPiece(board, i);
                moves.map((move) => {
                    whiteScope.push(move);
                    return;
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
            console.log(
                "trying",
                turnColor,
                board[position].color,
                board[position].piece,
                value
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
