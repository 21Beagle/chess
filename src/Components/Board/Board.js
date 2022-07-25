import React, { useState, useEffect } from "react";
import "./Board.css";
import Square from "../Square/Square";
import WinScreen from "../WinScreen/WinScreen";
import FENToBoard from "../../Util/FEN";
// import { coordinates } from "../../Util/cartesianToArray";
import { playerColorOpposite, pickRandomFromArray, findAllMovesWithEqualEvaluation, getEnPassant, tryMove, isPawnPromotion } from "../../Util/tools";
import {
    availableBishopMoves,
    availableKingMoves,
    availableKnightMoves,
    availableQueenMoves,
    availableRookMoves,
    availablePawnMoves,
} from "../../Util/AvailableMoves";
import { CASTLE_AVAILABLE, COLOR, EMPTY_SQUARE, PIECES, CHECK, CASTLE_PERMA, TOP_RANK, BOTTOM_RANK, STALEMATE } from "../../Consts/Consts";
import evaluate, { getBoardState } from "../../Util/value";
import { Move } from "../../Models/Move";

function Board() {
    const FENstart = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const FENTest = "k7/1p6/1P6/8/8/8/rq6/7K w KQkq - 0 1";

    const [board, setBoard] = useState(FENToBoard(FENTest).board);
    const [turnColor, setTurnColor] = useState(COLOR.WHITE);
    const [castlePerma, setCastlePerma] = useState(CASTLE_PERMA);
    const [whiteMoveScope, setWhiteMoveScopes] = useState(blackMovesScopeInit(board));
    const [blackMoveScope, setBlackMoveScopes] = useState(whiteMovesScopeInit(board));
    const [castle, setCastle] = useState(checkForCastle(board));
    const [check, setCheck] = useState(CHECK);
    const [availableMoves, setAvailableMoves] = useState([]);
    const [isSquareAvailable, setIsSquareAvailable] = useState(initIsSquare());
    const [isSquareSelected, setIsSquareSelected] = useState(initIsSquare());
    const [whiteAvailableMoves, setWhiteAvailableMoves] = useState(whiteMovesScopeInit(board));
    const [blackAvailableMoves, setBlackAvailableMoves] = useState(blackMovesScopeInit(board));
    const [selectedSquare, setSelectedSquare] = useState(-1);
    const [enPassant, setEnPassant] = useState(-1);
    const [promotion, setPromotion] = useState(false);
    const [promotionTile, setPromotionTile] = useState(-1);
    const [gameEnded, setGameEnded] = useState("");
    const [boardValue, setBoardValue] = useState(0);
    const [botColor, setBotColor] = useState(COLOR.BLACK);

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
        handleWin();
        // eslint-disable-next-line
    }, [whiteAvailableMoves, blackAvailableMoves]);

    useEffect(() => {
        let val = evaluate(board, enPassant, castlePerma);
        setBoardValue(val);
    }, [whiteAvailableMoves, blackAvailableMoves]);

    useEffect(() => {
        let moves = botAvailableMoves();
        if (turnColor === botColor && moves.length !== 0) {
            botMove(moves);
        }
    }, [whiteAvailableMoves, blackAvailableMoves]);

    let valueArray = [];
    let moveArray = [];

    function botMove(moves) {
        let availableMoves = moves;

        let botMoveMultiverse = availableMoves.map((move) => {
            let newBoard = tryMove(board, move, enPassant);
            let newEnPassant = getEnPassant(newBoard, move);

            let moveAndMultiverse = {
                value: evaluate(newBoard, newEnPassant, castlePerma),
                board: newBoard,
                end: move.newPosition,
                move: move,
            };

            valueArray.push(moveAndMultiverse.value);
            moveArray.push(moveAndMultiverse.move);

            return moveAndMultiverse;
        });
        console.log(botMoveMultiverse);
        let move = findBestMoveForBot(botMoveMultiverse, valueArray);
        handleBotMove(board, move, enPassant);
    }

    function handleMove(move) {
        let oldPosition = move.oldPosition;
        let newPosition = move.newPosition;

        checkEnPassant(move);

        let newBoard = board;

        newBoard[newPosition] = { ...board[oldPosition] };
        newBoard[oldPosition] = { ...EMPTY_SQUARE };

        if (isPawnPromotion(newBoard, newPosition) === true) {
            setPromotion(true);
            setPromotionTile(newPosition);
            setBoard([...newBoard]);
            return;
        }
        ifKingMovesRemoveCastle(newBoard, move);
        ifRookMovesRemoveCastle(newBoard, move);

        handleCastleMove(oldPosition, newPosition, newBoard);

        setBoard([...newBoard]);
        togglePlayerTurn();
    }

    function handleBotMove(board, move, enPassant) {
        let newBoard = tryMove(board, move, enPassant);

        ifKingMovesRemoveCastle(newBoard, move);
        ifRookMovesRemoveCastle(newBoard, move);

        checkEnPassant(move);

        setBoard([...newBoard]);
        togglePlayerTurn();
    }

    function findBestMoveForBot(moveAndMultiverseArray, valueArray) {
        let bestMoves = findAllMovesWithEqualEvaluation(valueArray, moveAndMultiverseArray, botColor);

        var bestMove = pickRandomFromArray(bestMoves).move;

        return bestMove;
    }

    function botAvailableMoves(availableMoves) {
        botColor === COLOR.BLACK ? (availableMoves = blackAvailableMoves) : (availableMoves = whiteAvailableMoves);
        return availableMoves;
    }

    function handleClick(squareIndex) {
        if (promotion) return;

        if (isSquareSelected[squareIndex] === true) {
            unselectAll();
            hideAvailableMovesAll();
            return;
        }
        if (isSquareAvailable[squareIndex] === true) {
            let move = new Move([selectedSquare, squareIndex]);
            handleMove(move);
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
        if (turnColor === COLOR.WHITE && whiteAvailableMoves.length === 0 && check.WHITE) {
            setGameEnded(COLOR.BLACK);
        }
        if (turnColor === COLOR.BLACK && blackAvailableMoves.length === 0 && check.BLACK) {
            setGameEnded(COLOR.WHITE);
        }
        if (turnColor === COLOR.BLACK && blackAvailableMoves.length === 0 && !check.BLACK) {
            setGameEnded(STALEMATE);
        }
        if (turnColor === COLOR.BLACK && blackAvailableMoves.length === 0 && !check.BLACK) {
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
        if (castlePerma.WHITE_LONG && !board[57].piece && !board[58].piece && !board[59].piece && !whiteLongCheck) {
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
        if (castlePerma.WHITE_SHORT && !board[61].piece && !board[62].piece && !whiteShortCheck) {
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
        if (castlePerma.BLACK_LONG && !board[1].piece && !board[2].piece && !board[3].piece && !blackLongCheck) {
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

        if (castlePerma.BLACK_SHORT && !board[5].piece && !board[6].piece && !blackShortCheck) {
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
            if (newBoard[i].piece === "") continue;

            let squareAvailableMoves = getAvailableMoves(board, i);
            availableMoves[i] = [...squareAvailableMoves];

            squareAvailableMoves.map((move) => {
                return availableMoves.push(move);
            });

            if (newBoard[i].color === COLOR.WHITE) {
                squareAvailableMoves.map((move) => {
                    return whiteAvailableMoves.push(move);
                });
            }
            if (newBoard[i].color === COLOR.BLACK) {
                squareAvailableMoves.map((move) => {
                    return blackAvailableMoves.push(move);
                });
            }
        }

        setWhiteAvailableMoves([...whiteAvailableMoves]);
        setBlackAvailableMoves([...blackAvailableMoves]);
        setAvailableMoves([...availableMoves]);
        return availableMoves;
    }

    function isPlayerInCheck(board, playerColor = turnColor, fakeBoard = false) {
        let whiteScope = [...whiteMoveScope];
        let blackScope = [...blackMoveScope];

        if (fakeBoard) {
            [whiteScope, blackScope] = setScopeAll(board, true);
        }
        let newBoard = [...board];
        let checks = [];
        if (playerColor === COLOR.BLACK) {
            checks = whiteScope.map((move) => {
                let piece = newBoard[move.newPosition];
                return piece.piece === PIECES.KING.CODE && piece.color === COLOR.BLACK;
            });
        } else {
            checks = blackScope.map((move) => {
                let piece = newBoard[move.newPosition];
                return piece.piece === PIECES.KING.CODE && piece.color === COLOR.WHITE;
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
        playerColor === COLOR.WHITE ? setCheck({ ...check, WHITE: true }) : setCheck({ ...check, BLACK: true });
        return;
    }

    function togglePlayerTurn() {
        turnColor === COLOR.WHITE ? setTurnColor(COLOR.BLACK) : setTurnColor(COLOR.WHITE);
    }

    function handlePawnPromotion(newPiece) {
        let newBoard = board;

        newBoard[promotionTile].piece = newPiece;
        setPromotion(false);
        setPromotionTile(-1);
        setBoard([...newBoard]);
        togglePlayerTurn();
    }

    function ifKingMovesRemoveCastle(newBoard, move) {
        let oldPosition = move.oldPosition;
        let newPosition = move.newPosition;

        if (newBoard[newPosition].piece === PIECES.KING.CODE) {
            setCastleUnavailable(newBoard[newPosition].color);
        }
    }

    function ifRookMovesRemoveCastle(newBoard, move) {
        let oldPosition = move.oldPosition;
        let newPosition = move.newPosition;
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

    function checkEnPassant(move) {
        let oldPosition = move.oldPosition;
        let newPosition = move.newPosition;
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
        if (oldPiece === PIECES.PAWN.CODE && oldPosition - newPosition === -16) {
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
                availableMoves = availablePawnMoves(position, newBoard, enPassant);
                break;
            default:
                break;
        }

        availableMoves = availableMoves.filter((move) => {
            return move.newPosition < 64 && move.newPosition >= 0;
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
                availableMoves = availableKingMoves(position, newBoard, CASTLE_AVAILABLE);
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
        let availableMoves = scopeMoves.filter((move) => {
            if (board[move.oldPosition].color === board[move.newPosition].color) return false;
            let dummyBoard = tryMove(board, move, enPassant, castlePerma);
            let check = !isPlayerInCheck(dummyBoard, board[position].color, true);
            return check;
        });
        return availableMoves;
    }

    function pushAvailableMovesToSquares(availableMoves) {
        let newSquares = isSquareAvailable;
        for (let i in availableMoves) {
            let availableMoveIndex = availableMoves[i].newPosition;
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
                        pieceColor={turnColor}
                        handleClick={() => {
                            handlePawnPromotion(PIECES.QUEEN.CODE);
                        }}
                    />
                    <Square
                        piece={PIECES.ROOK.CODE}
                        pieceColor={turnColor}
                        handleClick={() => {
                            handlePawnPromotion(PIECES.ROOK.CODE);
                        }}
                    />
                    <Square
                        piece={PIECES.BISHOP.CODE}
                        pieceColor={turnColor}
                        handleClick={() => {
                            handlePawnPromotion(PIECES.BISHOP.CODE);
                        }}
                    />
                    <Square
                        piece={PIECES.KNIGHT.CODE}
                        pieceColor={turnColor}
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
        setWhiteAvailableMoves(whiteMovesScopeInit(board));
        setBlackAvailableMoves(blackMovesScopeInit(board));
        setSelectedSquare(-1);
        setEnPassant(-1);
        setPromotion(false);
        setPromotionTile(-1);
        setGameEnded("");
        setBotColor(playerColorOpposite(botColor));
    }

    let boardComponent = <></>;
    if (botColor === COLOR.BLACK) {
        boardComponent = board.map((square, value) => (
            <Square
                key={value}
                piece={square.piece}
                pieceColor={square.color}
                id={value}
                handleClick={(square) => handleClick(square)}
                availableMove={isSquareAvailable[value]}
                enPassantAvailable={enPassant === value}
                selected={isSquareSelected[value]}
            />
        ));
    } else {
        boardComponent = board
            .map((square, value) => (
                <Square
                    key={value}
                    piece={square.piece}
                    pieceColor={square.color}
                    id={value}
                    handleClick={(square) => handleClick(square)}
                    availableMove={isSquareAvailable[value]}
                    enPassantAvailable={enPassant === value}
                    selected={isSquareSelected[value]}
                />
            ))
            .reverse();
    }

    return (
        <div className="center">
            <div className="board-wrapper center">{boardComponent}</div>
            {promotionComponent}
            {winnerComponent}
            <div>{boardValue}</div>
            <button onClick={() => reset()}>reset</button>
        </div>
    );
}

export default Board;
