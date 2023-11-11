import React, { useState, useEffect } from "react";
import "./Board.css";

import Square from "../Square/Square";
import ChessGame from "../../Chess/ChessGame/ChessGame";
import Piece from "../../Chess/Pieces/Piece";
import Move from "../../Chess/Move/Move";
import Player from "../../Chess/Player/Player";
import Promotion from "../Promotion/Promotion";
import Search from "../../Chess/Search/Search";
import FEN from "../../Chess/FEN/FEN";

let testPosition: string | undefined;
// testPosition = "1r2r1k1/1bp1qppn/1p1p3p/p7/P1PPp2n/BBP1P1NP/4QPP1/1R2R1K1 b - a1 0 24";
// testPosition = "8/2n1pp2/4K3/6n1/8/8/8/8 w - - 0 24";
// testPosition = "q3k3/8/8/1N1N4/8/8/8/1K6 w - - 0 24";
// testPosition = "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1";
// testPosition = "r3k2r/pPpp1ppp/8/8/8/8/PPPP1PpP/R3K2R w KQkq - 0 1";
// testPosition = "r3k2r/pPpp1ppp/8/8/8/8/PPPP1PpP/R3K2R w KQkq c5 0 1";

const whitePlayer = new Player("W", true);
const blackPlayer = new Player("B", true);
const Chess = new ChessGame("" || testPosition, whitePlayer, blackPlayer);

function Board() {
    const [board, setBoard] = useState(Chess.board);
    const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
    const [highlightedMoves, setHighlightedMoves] = useState<Move[]>([]);
    const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
    const [playerTurn, setPlayerTurn] = useState(Chess.playerTurn);
    const [evaluation, setEvaluation] = useState(Chess.currentEvaluation);
    const [showPromotion, setShowPromotion] = useState(false);

    useEffect(() => {
        updateUI();
        handleCpuMove();
    }, [board, playerTurn]);

    useEffect(() => {
        Chess.updateUI = updateUI;
    }, []);

    function updateUI() {
        setBoard(Chess.board);
        setEvaluation(Chess.simpleEvaluate());
        setPlayerTurn(Chess.playerTurn);
    }

    function changeWhiteCpu() {
        Chess.whitePlayer.isHuman = !Chess.whitePlayer.isHuman;
    }

    function changeBlackCpu() {
        Chess.whitePlayer.isHuman = !Chess.whitePlayer.isHuman;
    }

    function handleCpuMove() {
        if (Chess.playerTurn.colour.isEqual(playerTurn.colour) && Chess.playerTurn.isCpu) {
            const move = Search.search(Chess);
            doMove(move);
        }
    }

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

    function handlePromotion(pieceId: string) {
        console.log(pieceId);
        if (!selectedPiece) return;
        const move = highlightedMoves.find((move) => {
            return move.isPromotion && move.promotionPiece === pieceId;
        });

        if (!move) return;
        doMove(move);
    }

    function changePlayer() {
        Chess.changePlayer();
    }

    function updateBoard() {
        setBoard([...Chess.board]);
    }

    // function updateEnPassant() {
    //     if (Chess.state.enPassant.index) {
    //         setEnPassant(Chess.state.enPassant.index);
    //     }
    // }

    function selectSquare(index: number) {
        const selectedPiece = Chess.selectPiece(index);
        if (!selectedPiece) return;
        if (selectedPiece.colour.id !== playerTurn.colour.id) {
            return;
        }
        setSelectedSquare(index);
        setSelectedPiece(selectedPiece);
        const moves = selectedPiece.moves(Chess, true);
        setHighlightedMoves(moves);
        console.log(moves);
    }

    function deselectSquare() {
        setSelectedSquare(null);
        Chess.deselectPiece();
        setHighlightedMoves([]);
    }

    function playerMakeMove(index: number) {
        const move = highlightedMoves.find((move) => {
            return move.end.index === index;
        });

        if (!move) return;
        if (move.isPromotion) {
            setShowPromotion(true);
            return;
        }

        doMove(move);
    }

    function doMove(move: Move) {
        move.do();
        updateBoard();
        setHighlightedMoves([]);
        changePlayer();
        Chess.simpleEvaluate();
        deselectSquare();
        setShowPromotion(false);
    }

    function isHighlightedMove(index: number | null): boolean {
        if (!selectedPiece) return false;
        return highlightedMoves.some((move) => {
            return move.end.index === index;
        });
    }

    function getLastMove() {
        return Chess.moveHistory.findLast((move) => {
            return move;
        });
    }

    function showWhiteMoves(): void {
        Search.searchForPlayer(Chess, whitePlayer);
    }

    function showBlackMovesMoves(): void {
        Search.searchForPlayer(Chess, blackPlayer);
    }

    function undoLastMove(): void {
        const move = Chess.moveHistory.pop();
        if (!move) return;
        move.undo();
        changePlayer();
        updateBoard();
    }

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
    let promotion = null;
    if (showPromotion && selectedPiece !== null) {
        promotion = <Promotion colour={selectedPiece.colour} handlePromotion={(pieceId: string) => handlePromotion(pieceId)} />;
    }

    return (
        <>
            <div className="center">
                <button onClick={() => console.log(selectedPiece, Chess)}>Debug</button>
                <button onClick={() => showWhiteMoves()}>White Moves</button>
                <button onClick={() => showBlackMovesMoves()}>Black Moves</button>
                <div className="board-wrapper center">{boardComponent}</div>
                {promotion}
                <p>value: {evaluation}</p>
                <button onClick={() => changeBlackCpu()}>Change black cpu</button>
                <button onClick={() => changeWhiteCpu()}>Change white cpu</button>
                <button onClick={() => undoLastMove()}> Undo last move</button>
                <p> {FEN.generateFEN(Chess)}</p>
            </div>
        </>
    );
}

export default Board;
