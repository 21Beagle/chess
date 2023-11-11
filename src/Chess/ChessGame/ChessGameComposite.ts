import FEN from "../FEN/FEN";
import Piece from "../Pieces/Piece";
import Player from "../Player/Player";
import ChessGameState from "./ChessGameState";

export type ChessGameComposite = {
    FEN: FEN;
    board: Piece[];
    state: ChessGameState;
    playerTurn: Player;
};
