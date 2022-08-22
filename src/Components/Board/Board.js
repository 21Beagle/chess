import React, { useState, useEffect } from "react";
import "./Board.css";
import Square from "../Square/Square";
import WinScreen from "../WinScreen/WinScreen";
import FENToBoard from "../../Util/FEN";
// import { coordinates } from "../../Util/cartesianToArray";
import {
    playerColorOpposite,
    pickRandomFromArray,
    getAvailableMoves,
    findAllMovesWithEqualEvaluation,
    getEnPassant,
    tryMove,
    isPawnPromotion,
    isPlayerInCheck,
    checkForCastle,
    getScopeAll,
    checkForCastleTemp,
} from "../../Util/tools";
import { showScopeForPiece } from "../../Util/AvailableMoves/AvailableMoves";
import { CASTLE_AVAILABLE, COLOR, EMPTY_SQUARE, PIECES, CHECK, CASTLE_PERMA, STALEMATE } from "../../Consts/Consts";
import evaluate, { getBoardState } from "../../Util/value";
import { Move } from "../../Models/Move";

function Board() {
    const FENstart = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const FENTest = "r3qb1k/1b4p1/p2pr2p/3n4/Pnp1N1N1/6RP/1B3PP1/1B1QR1K1 w - - bm Nxh6";
    const FENTestWhiteLong = "1r2k2r/P3P2P/P3p2p/1r6/8/8/p3p2p/1R2K2R w KQkq - 0 1";

    let init = FENToBoard(FENTestWhiteLong);

    let initBoard = init.board;
    let initTurnColor = init.turn;
    let initCastle = init.castle;
    let initEnPassant = init.enPassant;

    const [board, setBoard] = useState(initBoard);
    const [turnColor, setTurnColor] = useState(initTurnColor);
    const [castle, setCastle] = useState(initCastle);
    const [availableMoves, setAvailableMoves] = useState();
    const [isSquareAvailable, setIsSquareAvailable] = useState(initIsSquare());
    const [isSquareSelected, setIsSquareSelected] = useState(initIsSquare());
    const [whiteAvailableMoves, setWhiteAvailableMoves] = useState(whiteMovesScopeInit(board));
    const [blackAvailableMoves, setBlackAvailableMoves] = useState(blackMovesScopeInit(board));
    const [selectedSquare, setSelectedSquare] = useState(-1);
    const [enPassant, setEnPassant] = useState(initEnPassant);
    const [promotion, setPromotion] = useState(false);
    const [promotionTile, setPromotionTile] = useState(-1);
    const [gameEnded, setGameEnded] = useState("");
    const [boardValue, setBoardValue] = useState(0);
    const [botColor, setBotColor] = useState(COLOR.WHITE);
    const [lastMove, setLastMove] = useState(new Move([-1, -1]));
    const [gameLoaded, setGameLoaded] = useState(false);
    const [turnNo, setTurnNo] = useState(0);

    useEffect(() => {
        if (whiteAvailableMoves !== []) {
            setGameLoaded(true);
        }

        // eslint-disable-next-line
    }, [whiteAvailableMoves, blackAvailableMoves]);

    useEffect(() => {
        let scopes = getScopeAll(board, castle, enPassant);
        let castleTemp = checkForCastleTemp(board, castle, scopes);
        populateAllMoves(board, castleTemp, enPassant);
        if (gameLoaded) {
            handleWin(board, turnColor, scopes);
        }

        // eslint-disable-next-line
    }, [board, castle, boardValue, enPassant, gameLoaded]);

    useEffect(() => {
        let val = evaluate(board, enPassant, castle, turnNo);
        setBoardValue(val);
    }, [whiteAvailableMoves, blackAvailableMoves]);

    useEffect(() => {
        let moves = botAvailableMoves();
        if (turnColor === botColor && moves.length !== 0) {
            botMove(moves);
        }
    }, [whiteAvailableMoves, blackAvailableMoves]);

    function botMove(moves) {
        let availableMoves = moves;
        let valueArray = [];
        let moveArray = [];

        let botMoveMultiverse = availableMoves.map((move) => {
            let newBoard = tryMove(board, move, enPassant);
            let newEnPassant = getEnPassant(newBoard, move);

            let moveAndMultiverse = {
                value: evaluate(newBoard, newEnPassant, castle, turnNo + 1),
                board: newBoard,
                end: move.newPosition,
                move: move,
            };

            valueArray.push(moveAndMultiverse.value);
            moveArray.push(moveAndMultiverse.move);

            return moveAndMultiverse;
        });
        let move = findBestMoveForBot(botMoveMultiverse, valueArray);
        handleBotMove(board, move, enPassant);
        setLastMove(move);
        incrementTurnNumber(turnNo);
    }

    function handleMove(move) {
        let oldPosition = move.oldPosition;
        let newPosition = move.newPosition;

        let newBoard = board;
        let newEnPassant = getEnPassant(newBoard, move);
        setEnPassant(newEnPassant);

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
        setLastMove(move);

        togglePlayerTurn();
    }

    function handleBotMove(board, move, enPassant) {
        let newBoard = tryMove(board, move, enPassant);

        ifKingMovesRemoveCastle(newBoard, move);
        ifRookMovesRemoveCastle(newBoard, move);

        let newEnPassant = getEnPassant(board, move);
        setEnPassant(newEnPassant);

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
            incrementTurnNumber(turnNo);
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

    function handleWin(board, turnColor, scopes) {
        if (boardValue === -Infinity) {
            setGameEnded(COLOR.BLACK);
        }
        if (boardValue === Infinity) {
            setGameEnded(COLOR.WHITE);
        }
        if (turnColor === COLOR.BLACK && blackAvailableMoves.length === 0 && isPlayerInCheck(board, turnColor, scopes)) {
            setGameEnded(STALEMATE);
        }
        if (turnColor === COLOR.WHITE && whiteAvailableMoves.length === 0 && isPlayerInCheck(board, turnColor, scopes)) {
            setGameEnded(STALEMATE);
        }
    }

    function setCastleUnavailable(playerColor) {
        playerColor === COLOR.WHITE
            ? setCastle({
                  ...castle,
                  WHITE_LONG: false,
                  WHITE_SHORT: false,
              })
            : setCastle({
                  ...castle,
                  BLACK_LONG: false,
                  BLACK_SHORT: false,
              });
    }

    function populateAllMoves(board, castle, enPassant) {
        let availableMoves = [];
        let whiteAvailableMoves = [];
        let blackAvailableMoves = [];
        let newBoard = board;

        for (let i = 0; i < board.length; i++) {
            if (newBoard[i].piece === "") continue;

            let squareAvailableMoves = getAvailableMoves(board, i, castle, enPassant);
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

        updateAvailableMoves(whiteAvailableMoves, blackAvailableMoves, availableMoves);
        return availableMoves;
    }

    function updateAvailableMoves(whiteAvailableMoves, blackAvailableMoves, availableMoves) {
        setWhiteAvailableMoves([...whiteAvailableMoves]);
        setBlackAvailableMoves([...blackAvailableMoves]);
        setAvailableMoves([...availableMoves]);
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
                    setCastle({ ...castle, WHITE_LONG: false });
                    break;
                case 63:
                    setCastle({ ...castle, WHITE_SHORT: false });
                    break;
                case 0:
                    setCastle({ ...castle, BLACK_LONG: false });
                    break;
                case 7:
                    setCastle({ ...castle, BLACK_SHORT: false });
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
                let moves = showScopeForPiece(board, i, CASTLE_AVAILABLE, -1);
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
                let moves = showScopeForPiece(board, i, CASTLE_AVAILABLE, -1);
                moves.map((move) => {
                    whiteScope.push(move);
                    return 0;
                });
            }

            return whiteScope;
        }
    }

    function incrementTurnNumber(turnNo) {
        setTurnNo(turnNo + 1);
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
        setBoard(initBoard);
        setTurnColor(initTurnColor);
        setCastle(initCastle);
        setAvailableMoves();
        setIsSquareAvailable(initIsSquare());
        setIsSquareSelected(initIsSquare());
        setWhiteAvailableMoves(whiteMovesScopeInit(board));
        setBlackAvailableMoves(blackMovesScopeInit(board));
        setSelectedSquare(-1);
        setEnPassant(initEnPassant);
        setPromotion(false);
        setPromotionTile(-1);
        setGameEnded("");
        setBoardValue(0);
        setBotColor(playerColorOpposite(botColor));
        setLastMove(new Move([-1, -1]));
        setGameLoaded(false);
        setTurnNo(0);
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
                lastMove={value === lastMove.oldPosition || value === lastMove.newPosition}
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
                    lastMove={value === lastMove.oldPosition || value === lastMove.newPosition}
                />
            ))
            .reverse();
    }

    return (
        <div className="center">
            <button onClick={() => reset()}>Reset and change teams</button>

            <div className="board-wrapper center">{boardComponent}</div>
            {promotionComponent}
            {winnerComponent}
            <div>{boardValue}</div>
            <div>{turnNo}</div>
        </div>
    );
}

export default Board;
