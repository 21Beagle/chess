import Piece from "./Piece";
import { PIECES } from "../../Consts/Consts";
import ChessGame from "../ChessGame/ChessGame";
import Colour from "../Colour/Colour";
import Move from "../Move/Move";
import Position from "../Position/Position";

export default class King extends Piece {
    static id = "K";
    static name = "King";
    static value: 0;

    constructor(position: number, colour: Colour) {
        super(position, colour);
        this.maxFileDifference = 5;
        this.type = PIECES.KING;
    }

    private KING_VALUE_GRID = [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 2, 2, 2, 2, 1, 0,
        0, 1, 2, 4, 4, 2, 1, 0,
        0, 1, 2, 4, 4, 2, 1, 0,
        0, 1, 2, 2, 2, 2, 1, 0,
        0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ];

    get valueGrid() {
        return this.KING_VALUE_GRID;
    }

    private castleMoves(game: ChessGame) {
        let longKingEnd;
        let longRookEnd;
        let longRookStart;
        let shortKingEnd;
        let shortRookEnd;
        let shortRookStart;
        let shortMustBeEmpty;
        let longMustBeEmpty;
        let castleChange;

        if (this.isBlack) {
            longKingEnd = 2;
            longRookEnd = 3;
            longRookStart = 0;
            longMustBeEmpty = [1, 2, 3];
            castleChange = "q";

            shortKingEnd = 6;
            shortRookEnd = 5;
            shortRookStart = 7;
            shortMustBeEmpty = [5, 6];
            castleChange = "k";
        } else {
            longKingEnd = 58;
            longRookEnd = 59;
            longRookStart = 56;
            longMustBeEmpty = [57, 58, 59];
            castleChange = "Q";

            shortKingEnd = 62;
            shortRookEnd = 61;
            shortRookStart = 63;
            shortMustBeEmpty = [61, 62];
            castleChange = "K";
        }

        const castleLongMove = new Move(this, longKingEnd, game);
        castleLongMove.isCastleMove = true;
        castleLongMove.isAttack = false;

        const castleLongRookMove = new Move(game.getPieceAtPosition(new Position(longRookStart)), longRookEnd, game);
        castleLongRookMove.changePlayerAfterMove = false;
        castleLongMove.extraMoves.push(castleLongRookMove);

        const castleShortMove = new Move(this, shortKingEnd, game);
        castleShortMove.isCastleMove = true;
        castleShortMove.isAttack = false;

        const castleShortRookMove = new Move(game.getPieceAtPosition(new Position(shortRookStart)), shortRookEnd, game);
        castleShortRookMove.changePlayerAfterMove = false;

        castleShortMove.extraMoves.push(castleShortRookMove);

        castleShortMove.castleChange = castleChange;
        castleLongMove.castleChange = castleChange;

        castleLongMove.mustBeFree = longMustBeEmpty.map((index) => {
            return new Position(index);
        });

        castleShortMove.mustBeFree = shortMustBeEmpty.map((index) => {
            return new Position(index);
        });

        return [castleLongMove, castleShortMove];
    }

    _generateMoves(game: ChessGame): Move[] {
        let moves: Move[] = [];

        // directional moves
        this.appendMove(game, moves, this.directions.forward(1));
        this.appendMove(game, moves, this.directions.forward(1));
        this.appendMove(game, moves, this.directions.backward(1));
        this.appendMove(game, moves, this.directions.left(1));
        this.appendMove(game, moves, this.directions.right(1));
        this.appendMove(game, moves, this.directions.backwardLeft(1));
        this.appendMove(game, moves, this.directions.backwardRight(1));
        this.appendMove(game, moves, this.directions.forwardLeft(1));
        this.appendMove(game, moves, this.directions.forwardRight(1));

        moves.forEach((move) => {
            move.castleChange = "kqKQ";
        });

        //castle moves

        moves = moves.concat(this.castleMoves(game));

        return moves;
    }
}
