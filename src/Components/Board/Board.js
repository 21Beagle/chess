import React, { useState, useEffect } from "react";
import "./Board.css";
import Square from "../Square/Square";
import WinScreen from "../WinScreen/WinScreen";
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
    TOP_RANK,
    BOTTOM_RANK,
    STALEMATE,
} from "../../Consts/Consts";
import value from "../../Util/value";

function Board() {
    const FENstart = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    // const FENTest = "k7/2p5/8/8/1q6/8/2p5/K7 w KQkq - 0 1";

    const [board, setBoard] = useState(FENToBoard(FENstart).board);
    const [turnColor, setTurnColor] = useState(COLOR.WHITE);
    const [castlePerma, setCastlePerma] = useState(CASTLE_PERMA);
    const [whiteMoveScope, setWhiteMoveScopes] = useState(
        blackMovesScopeInit(board)
    );
    const [blackMoveScope, setBlackMoveScopes] = useState(
        whiteMovesScopeInit(board)
    );
    const [castle, setCastle] = useState(checkForCastle(board));
    const [check, setCheck] = useState(CHECK);
    const [availableMoves, setAvailableMoves] = useState([]);
    const [isSquareAvailable, setIsSquareAvailable] = useState(initIsSquare());
    const [isSquareSelected, setIsSquareSelected] = useState(initIsSquare());
    const [whiteAvailableMoves, setWhiteAvailableMoves] = useState([1]);
    const [blackAvailableMoves, setBlackAvailableMoves] = useState([1]);
    const [selectedSquare, setSelectedSquare] = useState(-1);
    const [enPassant, setEnPassant] = useState(-1);
    const [promotion, setPromotion] = useState(false);
    const [promotionTile, setPromotionTile] = useState(-1);
    const [gameEnded, setGameEnded] = useState("");
    const [boardValue, setBoardValue] = useState(0);

    useEffect(() => {
        setScopeAll(board);
        // eslint-disable-next-line
    }, [board]);

    useEffect(() => {
        populateAllMoves(board);
        // eslint-disable-next-line
    }, [board, blackMoveScope, whiteMoveScope, castle]);

    useEffect(() => {
        updateCastle(board);
        // eslint-disable-next-line
    }, [board, blackMoveScope, whiteMoveScope]);

    useEffect(() => {
        isPlayerInCheck(board, turnColor);
        // eslint-disable-next-line
    }, [board, whiteAvailableMoves, blackAvailableMoves]);

    useEffect(() => {
        handleWin();
        // eslint-disable-next-line
    }, [check, whiteAvailableMoves, blackAvailableMoves]);

    useEffect(() => {
        let val = value(board);
        setBoardValue(val);
    }, [board]);

    function handleClick(squareIndex) {
        if (promotion) return;

        if (isSquareSelected[squareIndex] === true) {
            unselectAll();
            hideAvailableMovesAll();
            return;
        }
        if (isSquareAvailable[squareIndex] === true) {
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
            let moves = availableMoves[squareIndex];
            pushAvailableMovesToSquares(moves);
            return;
        } else {
            unselectAll();
            hideAvailableMovesAll();
            return;
        }
    }

    function handleWin() {
        if (
            turnColor === COLOR.WHITE &&
            whiteAvailableMoves.length === 0 &&
            check.WHITE
        ) {
            setGameEnded(COLOR.BLACK);
        }
        if (
            turnColor === COLOR.BLACK &&
            blackAvailableMoves.length === 0 &&
            check.BLACK
        ) {
            setGameEnded(COLOR.WHITE);
        }
        if (
            turnColor === COLOR.BLACK &&
            blackAvailableMoves.length === 0 &&
            !check.BLACK
        ) {
            setGameEnded(STALEMATE);
        }
        if (
            turnColor === COLOR.BLACK &&
            blackAvailableMoves.length === 0 &&
            !check.BLACK
        ) {
            setGameEnded(STALEMATE);
        }
    }

    function checkForCastle(board) {
        // white long
        let newCastle = CASTLE_AVAILABLE;

        let whiteLongCheck = blackMoveScope.map((value) => {
            return value === 59 || value === 58 || value === 57 || value === 60;
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
                return value === 60 || value === 61 || value === 62;
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
                return value === 1 || value === 2 || value === 3 || value === 4;
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
                return value === 4 || value === 5 || value === 6;
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

    function populateAllMoves(board) {
        let availableMoves = [];
        let whiteAvailableMoves = [];
        let blackAvailableMoves = [];
        let newBoard = [...board];

        for (let i = 0; i < board.length; i++) {
            newBoard[i].availableMoves = [];

            if (newBoard[i].piece === "") continue;

            let squareAvailableMoves = getAvailableMoves(board, i);
            availableMoves[i] = [...squareAvailableMoves];

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
        setAvailableMoves([...availableMoves]);
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
                    piece.piece === PIECES.KING.CODE &&
                    piece.color === COLOR.BLACK
                );
            });
        } else {
            checks = blackScope.map((value) => {
                let piece = newBoard[value];
                return (
                    piece.piece === PIECES.KING.CODE &&
                    piece.color === COLOR.WHITE
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

        isPawnPromotion(newBoard, newPosition);

        ifKingMovesRemoveCastle(newBoard, newPosition);
        ifRookMovesRemoveCastle(newPosition, oldPosition, newBoard);

        handleCastleMove(oldPosition, newPosition, newBoard);

        setBoard([...newBoard]);
    }

    function isPawnPromotion(newBoard, newPosition) {
        if (newBoard[newPosition].piece === PIECES.PAWN.CODE) {
            if (
                TOP_RANK.some((value) => {
                    return value === newPosition;
                }) ||
                BOTTOM_RANK.some((value) => {
                    return value === newPosition;
                })
            ) {
                setPromotionTile(newPosition);
                setPromotion(true);
            }
        }
    }

    function handlePawnPromotion(newPiece) {
        let newBoard = board;
        console.log(newPiece);

        newBoard[promotionTile].piece = newPiece;
        setPromotion(false);
        setPromotionTile(-1);
        setBoard([...newBoard]);
    }

    function ifKingMovesRemoveCastle(newBoard, newPosition) {
        if (newBoard[newPosition].piece === PIECES.KING.CODE) {
            setCastleUnavailable(newBoard[newPosition].color);
        }
    }

    function ifRookMovesRemoveCastle(newPosition, oldPosition, newBoard) {
        if (newBoard[newPosition].piece === PIECES.ROOK.CODE) {
            switch (oldPosition) {
                case 56:
                    setCastlePerma({ ...castlePerma, WHITE_LONG: false });
                    break;
                case 63:
                    setCastlePerma({ ...castlePerma, WHITE_SHORT: false });
                    break;
                case 0:
                    setCastlePerma({ ...castlePerma, BLACK_LONG: false });
                    break;
                case 7:
                    setCastlePerma({ ...castlePerma, BLACK_SHORT: false });
                    break;
                default:
                    break;
            }
        }
    }

    function handleCastleMove(oldPosition, newPosition, newBoard) {
        if (newBoard[newPosition].piece === PIECES.KING.CODE) {
            if (oldPosition === 60 && newPosition === 58) {
                newBoard[59] = { ...newBoard[56] };
                newBoard[56] = { ...EMPTY_SQUARE };
            }
            if (oldPosition === 60 && newPosition === 62) {
                newBoard[61] = { ...newBoard[63] };
                newBoard[63] = { ...EMPTY_SQUARE };
            }
            if (oldPosition === 4 && newPosition === 2) {
                newBoard[3] = { ...newBoard[0] };
                newBoard[0] = { ...EMPTY_SQUARE };
            }
            if (oldPosition === 4 && newPosition === 6) {
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
        if (oldPiece === PIECES.PAWN.CODE && oldPosition - newPosition === 16) {
            newEnPassant = oldPosition - 8;
        }
        if (
            oldPiece === PIECES.PAWN.CODE &&
            oldPosition - newPosition === -16
        ) {
            newEnPassant = oldPosition + 8;
        }
        if (newEnPassant !== -1) {
            newBoard[newEnPassant].enPassantAvailable = true;
        }
        setBoard([...newBoard]);
        setEnPassant(newEnPassant);
    }

    function selectSquare(square) {
        let newBoard = isSquareSelected;
        newBoard[square] = true;
        setIsSquareSelected([...newBoard]);
        return;
    }

    function unselectAll() {
        let newSquares = isSquareSelected;

        for (let i in isSquareSelected) {
            newSquares[i] = false;
        }
        setSelectedSquare(-1);

        setIsSquareSelected([...newSquares]);
        return newSquares;
    }

    function showScopeForPiece(board, position) {
        let newBoard = [...board];
        let square = newBoard[position];
        let availableMoves = [];
        switch (square.piece) {
            case PIECES.ROOK.CODE:
                availableMoves = availableRookMoves(position, newBoard);
                break;
            case PIECES.KNIGHT.CODE:
                availableMoves = availableKnightMoves(position, newBoard);
                break;
            case PIECES.BISHOP.CODE:
                availableMoves = availableBishopMoves(position, newBoard);
                break;
            case PIECES.QUEEN.CODE:
                availableMoves = availableQueenMoves(position, newBoard);
                break;
            case PIECES.KING.CODE:
                availableMoves = availableKingMoves(position, newBoard, castle);
                break;
            case PIECES.PAWN.CODE:
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

    function showScopeForPieceSimple(board, position) {
        let newBoard = [...board];
        let square = newBoard[position];
        let availableMoves = [];
        switch (square.piece) {
            case PIECES.ROOK.CODE:
                availableMoves = availableRookMoves(position, newBoard);
                break;
            case PIECES.KNIGHT.CODE:
                availableMoves = availableKnightMoves(position, newBoard);
                break;
            case PIECES.BISHOP.CODE:
                availableMoves = availableBishopMoves(position, newBoard);
                break;
            case PIECES.QUEEN.CODE:
                availableMoves = availableQueenMoves(position, newBoard);
                break;
            case PIECES.KING.CODE:
                availableMoves = availableKingMoves(
                    position,
                    newBoard,
                    CASTLE_AVAILABLE
                );
                break;
            case PIECES.PAWN.CODE:
                availableMoves = availablePawnMoves(position, newBoard, -1);
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
        return availableMoves;
    }

    function pushAvailableMovesToSquares(availableMoves) {
        let newSquares = isSquareAvailable;

        for (let i in availableMoves) {
            let availableMoveIndex = availableMoves[i];
            newSquares[availableMoveIndex] = true;
        }
        setIsSquareAvailable([...newSquares]);
    }

    function hideAvailableMovesAll() {
        let newSquares = isSquareAvailable;
        for (let i in board) {
            newSquares[i] = false;
        }
        setIsSquareAvailable([...newSquares]);
    }

    function initIsSquare() {
        let isSquareAvailable = [];
        for (let i = 0; i < 64; i++) {
            isSquareAvailable.push(false);
        }
        return isSquareAvailable;
    }

    function blackMovesScopeInit(board) {
        let blackScope = [];
        for (let i in board) {
            i = parseInt(i);
            if (!board[i].piece) continue;
            if (board[i].color === COLOR.BLACK) {
                let moves = showScopeForPieceSimple(board, i);
                moves.map((move) => {
                    blackScope.push(move);
                    return 0;
                });
            }
        }

        return blackScope;
    }

    function whiteMovesScopeInit(board) {
        let whiteScope = [];
        for (let i in board) {
            i = parseInt(i);
            if (!board[i].piece) continue;
            if (board[i].color === COLOR.WHITE) {
                let moves = showScopeForPieceSimple(board, i);
                moves.map((move) => {
                    whiteScope.push(move);
                    return 0;
                });
            }
        }

        return whiteScope;
    }

    let promotionComponent = <></>;
    if (promotion) {
        promotionComponent = (
            <>
                <div className="promotion center">
                    <Square
                        piece={PIECES.QUEEN.CODE}
                        pieceColor={playerColorOpposite(turnColor)}
                        handleClick={() => {
                            handlePawnPromotion(PIECES.QUEEN.CODE);
                        }}
                    />
                    <Square
                        piece={PIECES.ROOK.CODE}
                        pieceColor={playerColorOpposite(turnColor)}
                        handleClick={() => {
                            handlePawnPromotion(PIECES.ROOK.CODE);
                        }}
                    />
                    <Square
                        piece={PIECES.BISHOP.CODE}
                        pieceColor={playerColorOpposite(turnColor)}
                        handleClick={() => {
                            handlePawnPromotion(PIECES.BISHOP.CODE);
                        }}
                    />
                    <Square
                        piece={PIECES.KNIGHT.CODE}
                        pieceColor={playerColorOpposite(turnColor)}
                        handleClick={() => {
                            handlePawnPromotion(PIECES.KNIGHT.CODE);
                        }}
                    />
                </div>
            </>
        );
    }
    let winnerComponent;
    if (gameEnded !== "") {
        winnerComponent = <WinScreen reset={reset} whoWon={gameEnded} />;
    } else {
        winnerComponent = <></>;
    }

    function reset() {
        setBoard(FENToBoard(FENstart).board);
        setTurnColor(COLOR.WHITE);
        setCastlePerma(CASTLE_PERMA);
        setWhiteMoveScopes(blackMovesScopeInit(board));
        setBlackMoveScopes(whiteMovesScopeInit(board));
        setCastle(checkForCastle(board));
        setCastle(checkForCastle(board));
        setCheck(CHECK);
        setAvailableMoves([]);
        setIsSquareAvailable(initIsSquare());
        setIsSquareSelected(initIsSquare());
        setWhiteAvailableMoves([1]);
        setBlackAvailableMoves([1]);
        setSelectedSquare(-1);
        setEnPassant(-1);
        setPromotion(false);
        setPromotionTile(-1);
        setGameEnded("");
    }

    return (
        <div className="center">
            <div className="board-wrapper center">
                {board
                    .map((square, value) => (
                        <Square
                            key={value}
                            piece={square.piece}
                            pieceColor={square.color}
                            id={value}
                            handleClick={(square) => handleClick(square)}
                            availableMove={isSquareAvailable[value]}
                            enPassantAvailable={square.enPassantAvailable}
                            selected={isSquareSelected[value]}
                        />
                    ))
                    .reverse()}
            </div>

            {promotionComponent}
            {winnerComponent}
            <div>{boardValue}</div>
        </div>
    );
}

export default Board;
