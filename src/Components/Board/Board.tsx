import { useState, useEffect, useRef, useCallback } from "react";
import useSound from "use-sound";
import "./Board.css";


import Square from "../Square/Square";
import ChessGame from "../../Chess/ChessGame/ChessGame";
import Piece from "../../Chess/Pieces/Piece";
import Move from "../../Chess/Move/Move";
import Player from "../../Chess/Player/Player";
import Promotion from "../Promotion/Promotion";
import Search from "../../Chess/Search/Search";


import moveSound from "../../Media/Sounds/move.mp3";
import takeSound from "../../Media/Sounds/take.mp3";
import Information from "../Information/Information";
import Evaluation from "../Evaluation/Evaluation";
import useModal from "../Modal/useModal";


const white = new Player("W", true)
const black = new Player("B", true)

function Board() {

    const testPosition: string | undefined = undefined;
    // testPosition = "1r2r1k1/1bp1qppn/1p1p3p/p7/P1PPp2n/BBP1P1NP/4QPP1/1R2R1K1 b - a1 0 24";
    // testPosition = "8/2n1pp2/4K3/6n1/8/8/8/8 w - - 0 24";
    // testPosition = "q3k3/8/8/1N1N4/8/8/8/1K6 w - - 0 24";


    const [whitePlayerIsCpu, setWhitePlayerIsCpu] = useState(white.isCpu);
    const [blackPlayerIsCpu, setBlackPlayerIsCpu] = useState(black.isCpu);

    const Chess = useRef(new ChessGame("" || testPosition, white, black)).current;
    const [board, setBoard] = useState(Chess.board);
    const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
    const [highlightedMoves, setHighlightedMoves] = useState<Move[]>([]);
    const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
    const [playerTurn, setPlayerTurn] = useState(Chess.playerTurn);
    const [showPromotion, setShowPromotion] = useState(false);

    const [viewFlipped, setViewFlipped] = useState(false);

    const [playMove] = useSound(moveSound);
    const [playTake] = useSound(takeSound);

    const [modal, setModal] = useModal();




    const updateUI = useCallback((board: Piece[], playerTurn: Player, whiteIsCpu: boolean, blackIsCpu: boolean) => {
        setBoard(board);
        setPlayerTurn(() => playerTurn);
        setWhitePlayerIsCpu(() => whiteIsCpu);
        setBlackPlayerIsCpu(() => blackIsCpu);
    }, [Chess])


    useEffect(() => {
        updateUI(Chess.board, Chess.playerTurn, Chess.whitePlayer.isCpu, Chess.blackPlayer.isCpu);
    }, [Chess, updateUI, Chess.board, Chess.playerTurn, Chess.whitePlayer.isCpu, Chess.blackPlayer.isCpu]);


    function changeWhiteCpu() {
        Chess.whitePlayer.isHuman = !Chess.whitePlayer.isHuman;
        setWhitePlayerIsCpu(() => Chess.whitePlayer.isCpu);
        setBlackPlayerIsCpu(() => Chess.blackPlayer.isCpu);
    }

    function changeBlackCpu() {
        Chess.blackPlayer.isHuman = !Chess.blackPlayer.isHuman;
        setWhitePlayerIsCpu(() => Chess.whitePlayer.isCpu);
        setBlackPlayerIsCpu(() => Chess.blackPlayer.isCpu);
    }

    function handleCpuMove() {
        if (Chess.playerTurn.colour.isEqual(playerTurn.colour) && Chess.playerTurn.isCpu) {
            const move = Search.search(Chess, 2);
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


    function selectSquare(index: number) {
        const selectedPiece = Chess.selectPiece(index);
        if (!selectedPiece) return;
        if (selectedPiece.colour.id !== playerTurn.colour.id) {
            return;
        }
        setSelectedSquare(index);
        setSelectedPiece(selectedPiece);
        const moves = selectedPiece.generateMoves(Chess);
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
        handleSound(move);

    }

    function handleSound(move: Move) {
        if (move.isCapture) {
            playTake();
        } else {
            playMove();
        }
    }

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

    function undoLastMove(): void {
        const move = Chess.moveHistory.pop();
        if (!move) return;
        move.undo();
        changePlayer();
        updateBoard();
    }

    function flipView(): void {
        setViewFlipped(() => !viewFlipped);
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

    if (viewFlipped) {
        boardComponent.reverse();
    }

    let promotion = null;
    if (showPromotion && selectedPiece !== null) {
        promotion = <Promotion colour={selectedPiece.colour} handlePromotion={(pieceId: string) => handlePromotion(pieceId)} />;
    }




    if (Chess.playerTurn.isCpu) {
        handleCpuMove();
    }



    return (
        <>
            <div className="game-wrapper thick-border center">
                {promotion}
                <Evaluation evaluation={Chess.simpleEvaluate()} />
                <div className="board-wrapper ">{boardComponent}</div>
                <Information undoLastMove={undoLastMove} Chess={Chess} blackPlayerIsCpu={blackPlayerIsCpu} whitePlayerIsCpu={whitePlayerIsCpu}
                    changeBlackCpu={changeBlackCpu} changeWhiteCpu={changeWhiteCpu} flipView={flipView}
                ></Information>
                {/* <button onClick={() => console.log(selectedPiece, Chess)}>Debug</button> */}
            </div >
            <button onClick={() => setModal({ buttons: [], message: "hello", modalOpen: true })}> set</button>
            {modal}
        </>
    );
}

export default Board;
