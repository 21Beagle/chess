import React from "react";
import white from "../../Media/StandardPieces/whitePawn.svg";
import black from "../../Media/StandardPieces/blackPawn.svg";
import { pieceProps } from "./piecePropsType";

function Pawn(props: pieceProps) {
    let iconSrc;
    let alt;
    if (props.colour.isWhite) {
        iconSrc = white;
        alt = "White Pawn";
    } else {
        iconSrc = black;
        alt = "Black Pawn";
    }
    return <img className="piece-icon" src={iconSrc} alt={alt}></img>;
}
export default Pawn;
