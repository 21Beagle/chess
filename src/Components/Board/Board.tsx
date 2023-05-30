import React, { useState, useEffect, Dispatch, Component } from "react";
import "./Board.css";

import Square from "../Square/Square";
import ChessGame from "../../Chess/ChessGame/ChessGame";
import Piece from "../../Chess/Pieces/Piece";
import Move from "../../Chess/Move/Move";
import Colour from "../../Chess/Colour/Colour";
import Player from "../../Chess/Player/Player";
import search from "../../Chess/Search/Search";

let testPosition: string | undefined;
// testPosition = "1r2r1k1/1bp1qppn/1p1p3p/p7/P1PPp2n/BBP1P1NP/4QPP1/1R2R1K1 b - - 0 24";
// testPosition = "8/2n1pp2/4K3/6n1/8/8/8/8 w - - 0 24";
// testPosition = "q3k3/8/8/1N1N4/8/8/8/1K6 w - - 0 24";
// testPosition = "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1";

let whitePlayer = new Player("W", true);
let blackPlayer = new Player("B", false);
const Chess = new ChessGame("" || testPosition, whitePlayer, blackPlayer);

function Board() {
    const [board, setBoard] = useState(Chess.board);
    const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
    const [highlightedMoves, setHighlightedMoves] = useState<Move[]>([]);
    const [selectedSquare, setSelectedSquare] = useState<any | null>(null);
    const [enPassant, setEnPassant] = useState(Chess.enPassantPosition.index);
    const [playerTurn, setPlayerTurn] = useState(Chess.playerTurn);
    const [evaluation, setEvaluation] = useState(Chess.currentEvaluation);

    useEffect(() => {
        setBoard(Chess.board);
        setEvaluation(Chess.simpleEvaluate());
        setPlayerTurn(Chess.playerTurn);
        handleCpuMove();
    }, [board, playerTurn]);

    useEffect(() => {
        updateEnPassant();
    });

    function changeWhiteCpu() {
        Chess.whitePlayer.isHuman = !Chess.whitePlayer.isHuman;
    }

    function changeBlackCpu() {
        Chess.whitePlayer.isHuman = !Chess.whitePlayer.isHuman;
    }

    function handleCpuMove() {
        if (Chess.playerTurn.colour.isEqual(playerTurn.colour) && Chess.playerTurn.isCpu) {
            let move = Chess.pickBestMove(Chess.playerTurn);
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

    function changePlayer() {
        Chess.changePlayer();
    }

    function updateBoard() {
        setBoard([...Chess.board]);
    }

    function updateEnPassant() {
        if (Chess.enPassantPosition.index) {
            setEnPassant(Chess.enPassantPosition.index);
        }
    }

    function selectSquare(index: number) {
        let selectedPiece = Chess.selectPiece(index);
        if (!selectedPiece) return;
        if (selectedPiece.colour.id !== playerTurn.colour.id) {
            return;
        }
        setSelectedSquare(index);
        setSelectedPiece(selectedPiece);
        let moves = selectedPiece.moves(Chess, true);
        setHighlightedMoves(moves);
        console.log(moves);
    }

    function deselectSquare() {
        setSelectedSquare(null);
        Chess.deselectPiece();
        setHighlightedMoves([]);
    }

    function playerMakeMove(index: number) {
        let move = highlightedMoves.find((move) => {
            return move.end.index === index;
        });
        if (!move) return;
        doMove(move);
    }

    function doMove(move: Move) {
        move.do(Chess);
        updateBoard();
        setHighlightedMoves([]);
        changePlayer();
        Chess.simpleEvaluate();
        deselectSquare();
    }

    function isHighlightedMove(index: number | null): boolean {
        if (!selectedPiece) return false;
        return highlightedMoves.some((move) => {
            return move.end.index === index;
        });
    }

    function showWhiteMoves(): void {
        Chess.pickBestMove(whitePlayer);
    }

    function showBlackMovesMoves(): void {
        Chess.pickBestMove(blackPlayer);
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
            />
        );
    });

    return (
        <div className="center">
            <button onClick={() => console.log(selectedPiece, Chess)}>Debug</button>
            <button onClick={() => showWhiteMoves()}>White Moves</button>
            <button onClick={() => showBlackMovesMoves()}>Black Moves</button>
            <div className="board-wrapper center">{boardComponent}</div>
            <p>value: {evaluation}</p>
            <button onClick={() => changeBlackCpu()}>Change black cpu</button>
            <button onClick={() => changeWhiteCpu()}>Change white cpu</button>
        </div>
    );
}

export default Board;
