import React from "react";
import Colour from "../../Chess/Colour/Colour";
import Position from "../../Chess/Position/Position";
import Rook from "../Pieces/Rook";
import Pawn from "../Pieces/Pawn";
import King from "../Pieces/King";
import Queen from "../Pieces/Queen";
import Knight from "../Pieces/Knight";
import { PIECES } from "../../Consts/Consts";
import Bishop from "../Pieces/Bishop";

type Props = {
    colour: Colour;
    handlePromotion: Function;
    pieceId: string;
};

function PromotionSquare(props: Props) {
    let className;
    let component;
    switch (props.pieceId) {
        case PIECES.ROOK.id:
            component = <Rook colour={props.colour} />;
            break;
        case PIECES.QUEEN.id:
            component = <Queen colour={props.colour} />;
            break;
        case PIECES.KNIGHT.id:
            component = <Knight colour={props.colour} />;
            break;
        case PIECES.BISHOP.id:
            component = <Bishop colour={props.colour} />;
            break;
        default:
            component = <></>;
            break;
    }

    return (
        <>
            <div onClick={() => props.handlePromotion(props.pieceId)} className={className + " tile"}>
                {component}
            </div>
        </>
    );
}

export default PromotionSquare;
