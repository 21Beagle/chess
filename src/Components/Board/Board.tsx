import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import useSound from "use-sound";
import "./Board.css";

import Square from "../Square/Square";
import ChessGame from "../../Chess/ChessGame/ChessGame";
import Piece from "../../Chess/Pieces/Piece";
import Move from "../../Chess/Move/Move";
import Player from "../../Chess/Player/Player";

import moveSound from "../../Media/Sounds/move.mp3";
import takeSound from "../../Media/Sounds/take.mp3";
// import Information from "../Information/Information";
import Evaluation from "../Evaluation/Evaluation";
import useModal from "../Modal/useModal";
import Evaluate from "../../Chess/Evaluate/Evaluate";
import { PIECES } from "../../Consts/Consts";
// import GameSettings from "../GameSettings/GameSettings";
import FEN from "../../Chess/FEN/FEN";
import PlayerInfo from "../PlayerInfo/PlayerInfo";

const white = new Player("W", true);
const black = new Player("B", false);

function Board() {
    const testPosition: string | undefined = undefined;
    // testPosition = "1r2r1k1/1bp1qppn/1p1p3p/p7/P1PPp2n/BBP1P1NP/4QPP1/1R2R1K1 b - a1 0 24";
    // testPosition = "8/2n1pp2/4K3/6n1/8/8/8/8 w - - 0 24";
    // testPosition = "q3k3/8/8/1N1N4/8/8/8/1K6 w - - 0 24";
    // testPosition = "3k4/8/1N4q1/8/6Q1/8/8/3K4 w - - 0 1"
    // testPosition = "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1";

    const searchWorker = useMemo(() => {
        return new Worker(new URL("../../searchWorker.ts", import.meta.url), { type: "module" });
    }, []);

    const Chess = useRef(new ChessGame("" || testPosition, white, black)).current;
    const [board, setBoard] = useState(Chess.board);
    const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
    const [highlightedMoves, setHighlightedMoves] = useState<Move[]>([]);
    const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
    const [showPromotion, setShowPromotion] = useState(false);
    const [searchingForMove, setSearchingForMove] = useState(false);

    const [viewFlipped, setViewFlipped] = useState(false);

    const [playMove] = useSound(moveSound);
    const [playTake] = useSound(takeSound);

    const [modal, setModal] = useModal();

    // use Callbacks

    const updateUI = useCallback(
        (board: Piece[]) => {
            setBoard([...board]);
        },
        [setBoard]
    );

    const handleSound = useCallback(
        (move: Move) => {
            if (move.isCapture) {
                playTake();
            } else {
                playMove();
            }
        },
        [playMove, playTake]
    );

    // const changePlayer = useCallback(() => {
    //     Chess.changePlayer();
    // }, [Chess]);

    const deselectSquare = useCallback(() => {
        setSelectedSquare(null);
        Chess.deselectPiece();
        setHighlightedMoves([]);
    }, [Chess, setHighlightedMoves, setSelectedSquare]);

    const doMove = useCallback(
        (move: Move) => {
            move.do();
            updateUI(Chess.board);
            setHighlightedMoves([]);
            Evaluate.simple(Chess);
            deselectSquare();
            setShowPromotion(false);
            handleSound(move);
        },
        [Chess, updateUI, deselectSquare, handleSound]
    );

    const handleCpuMove = useCallback(() => {
        if (Chess.playerTurn.isHuman || searchingForMove === true) {
            return;
        }
        console.time("Finding best move");

        setSearchingForMove(true);
        const fen = FEN.generateFEN(Chess);
        searchWorker.postMessage(fen, {});
        searchWorker.onmessage = (e) => {
            const returnedMove = e.data;
            console.log(returnedMove);
            console.timeEnd("Finding best move");
            const filter = {
                colour: Chess.playerTurn.colour,
            };

            const generatedMoves = Chess.getMoves(filter);
            const move = generatedMoves.find((generatedMove) => {
                return (
                    generatedMove.start.index === returnedMove.start._index &&
                    generatedMove.end.index === returnedMove.end._index &&
                    generatedMove.piece.type.id === returnedMove.piece.type.id &&
                    generatedMove.promotionPiece === returnedMove.promotionPiece
                );
            });

            if (!move) return;
            setSearchingForMove(false);
            doMove(move);
            updateUI(Chess.board);
        };
    }, [Chess, searchWorker, doMove, updateUI, searchingForMove, setSearchingForMove]);

    const resetBoard = useCallback(
        (whitePlayerHuman: boolean = true, blackPlayerHuman: boolean = false) => {
            Chess.resetBoard(whitePlayerHuman, blackPlayerHuman);
            updateUI(Chess.board);
            if (blackPlayerHuman) {
                setViewFlipped(true);
            }
        },
        [Chess, updateUI]
    );

    const isWinner = useCallback(() => {
        if (Evaluate.isCheckMate(Chess)) {
            setModal({
                title: `${Chess.playerTurn.colour.opposite.name} is the winner`,
                message: "Play again?",
                buttons: [
                    {
                        text: "Play as white",
                        onClick: () => resetBoard(true, false),
                    },
                    {
                        text: "Play as Black",
                        onClick: () => resetBoard(false, true),
                    },
                ],
                modalOpen: true,
            });
            return true;
        }
        return false;
    }, [Chess, setModal, resetBoard]);

    // use Effect

    useEffect(() => {
        handleCpuMove();
        isWinner();
    }, [handleCpuMove, Chess.playerTurn.colour.id, isWinner]);

    // handle this handle that

    function handleClick(index: number) {
        if (isHighlightedMove(index)) {
            playerMakeMove(index);
            return;
        }
        if (selectedSquare === index) {
            deselectSquare();
            return;
        }
        selectSquare(index);
    }

    function handlePromotion(move: Move, pieceId: string) {
        console.log(pieceId);
        if (!selectedPiece) return;
        const promotionMove = highlightedMoves.find((highlightedMove) => {
            return highlightedMove.isPromotion && highlightedMove.promotionPiece === pieceId && highlightedMove.end.index === move.end.index;
        });

        if (!promotionMove) return;
        doMove(promotionMove);
    }

    function selectSquare(index: number) {
        const selectedPiece = Chess.selectPiece(index);
        if (!selectedPiece) return;
        if (selectedPiece.colour.id !== Chess.playerTurn.colour.id || Chess.playerTurn.isCpu) {
            return;
        }
        setSelectedSquare(index);
        setSelectedPiece(selectedPiece);
        const moves = selectedPiece.generateMoves(Chess);
        setHighlightedMoves(moves);
        console.log(moves);
    }

    function playerMakeMove(index: number) {
        const move = highlightedMoves.find((move) => {
            return move.end.index === index;
        });

        if (!move) return;
        if (!move.isPromotion) return doMove(move);
        setModal({
            title: "Promotion",
            buttons: [
                {
                    text: "Queen",
                    onClick: () => handlePromotion(move, PIECES.QUEEN.id),
                    icon: "Queen",
                    pieceIconColour: move.piece.colour.id,
                },
                {
                    text: "Knight",
                    onClick: () => handlePromotion(move, PIECES.KNIGHT.id),
                    icon: "Knight",
                    pieceIconColour: move.piece.colour.id,
                },
                {
                    text: "Bishop",
                    onClick: () => handlePromotion(move, PIECES.BISHOP.id),
                    icon: "Bishop",
                    pieceIconColour: move.piece.colour.id,
                },
                {
                    text: "Rook",
                    onClick: () => handlePromotion(move, PIECES.ROOK.id),
                    icon: "Rook",
                    pieceIconColour: move.piece.colour.id,
                },
            ],
            modalOpen: true,
        });
    }

    // actions and properties

    function isHighlightedMove(index: number | null): boolean {
        if (!selectedPiece) return false;
        return highlightedMoves.some((move) => {
            return move.end.index === index;
        });
    }

    function getLastMove() {
        return Chess.moveHistory.findLast((move: Move) => {
            return move;
        });
    }

    // function showWhiteMoves(): void {
    //     Search.searchForPlayer(Chess, white);
    // }

    // function showBlackMovesMoves(): void {
    //     Search.searchForPlayer(Chess, black);
    // }

    // function undoLastMove(): void {
    //     const move = Chess.moveHistory.pop();
    //     if (!move) return;
    //     move.undo();
    //     changePlayer();
    //     updateUI(Chess.board);
    // }

    // function flipView(): void {
    //     setViewFlipped(() => !viewFlipped);
    // }

    // render

    const boardComponent = board.map((piece, index) => {
        return (
            <Square
                key={piece.position.index}
                piece={piece}
                index={index}
                position={piece.position}
                selected={piece.selected}
                handleClick={(piece: number) => handleClick(piece)}
                highlighted={isHighlightedMove(piece.position.index)}
                isEnpassant={Chess.state.enPassant !== null && piece.position.index === Chess.state.enPassant.index}
                lastMove={getLastMove()}
            />
        );
    });

    if (viewFlipped) {
        boardComponent.reverse();
    }

    if (showPromotion && selectedPiece !== null) {
        setShowPromotion(false);
    }

    // function openSettings() {
    //     setModal({
    //         title: "Settings",
    //         component: <GameSettings chess={Chess} />,
    //         buttons: [
    //             {
    //                 onClick: () => {},
    //                 text: "Close",
    //             },
    //         ],
    //         modalOpen: true,
    //     });
    // }

    return (
        <div className="game-wrapper-outer thick-border center ">
            <PlayerInfo isThinking={Chess.playerTurn.colour.isEqual(black.colour)} isHuman={Chess.blackPlayer.isHuman} />

            <div className="game-wrapper ">
                <Evaluation evaluation={Evaluate.simple(Chess)} />
                <div className="board-wrapper ">{boardComponent}</div>
                {/* <Information openSettings={openSettings} undoLastMove={undoLastMove} Chess={Chess} flipView={flipView}></Information> */}
            </div>
            <PlayerInfo isThinking={Chess.playerTurn.colour.isEqual(white.colour)} isHuman={Chess.whitePlayer.isHuman} />
            {modal}
        </div>
    );
}

export default Board;
