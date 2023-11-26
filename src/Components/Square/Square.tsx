import "./Square.css";

import King from "../Pieces/King";
import Queen from "../Pieces/Queen";
import Rook from "../Pieces/Rook";
import Bishop from "../Pieces/Bishop";
import Knight from "../Pieces/Knight";
import Pawn from "../Pieces/Pawn";
import { PIECES } from "../../Consts/Consts";
import Piece from "../../Chess/Pieces/Piece";
import Position from "../../Chess/Position/Position";
import Move from "../../Chess/Move/Move";

type squareProps = {
    index: number;
    piece: Piece;
    highlighted: boolean;
    handleClick: (index: number) => void;
    selected: boolean;
    position: Position;
    lastMove: Move | undefined;
    isEnpassant?: boolean;
};

function Square(props: squareProps): JSX.Element {
    let className;
    if (props.index % 16 < 8) {
        className = props.index % 2 === 0 ? "black-tile" : "white-tile";
    } else {
        className = props.index % 2 !== 0 ? "black-tile" : "white-tile";
    }

    if (props.isEnpassant) {
        className = "en-passant";
    }

    if (props.selected) {
        className += " selected";
    }

    if (props.lastMove && (props.lastMove.start.index === props.index || props.lastMove.end.index === props.index)) {
        className += " last-move";
    }

    let component;
    switch (props.piece.type.id) {
        case PIECES.ROOK.id:
            component = <Rook selected={props.selected} colour={props.piece.colour} />;
            break;
        case PIECES.PAWN.id:
            component = <Pawn selected={props.selected} colour={props.piece.colour} />;
            break;
        case PIECES.KING.id:
            component = <King selected={props.selected} colour={props.piece.colour} />;
            break;
        case PIECES.QUEEN.id:
            component = <Queen selected={props.selected} colour={props.piece.colour} />;
            break;
        case PIECES.KNIGHT.id:
            component = <Knight selected={props.selected} colour={props.piece.colour} />;
            break;
        case PIECES.BISHOP.id:
            component = <Bishop selected={props.selected} colour={props.piece.colour} />;
            break;
        default:
            component = <></>;
            break;
    }

    return (
        <div onClick={() => props.handleClick(props.index)} className={className + " tile"}>
            {props.highlighted && <div className="available-move"></div>}
            {<p className="id-no">
                {props.position.an}
            </p>}
            {/* <p className="file-rank">
                ({props.position.file}, {props.position.rank})
            </p> */}
            {component}
        </div>
    );
}

export default Square;
