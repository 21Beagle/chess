import React from "react";
import white from "../../Media/StandardPieces/whitePawn.svg";
import black from "../../Media/StandardPieces/blackPawn.svg";
import { COLOR } from "../../Consts/Consts";

function Pawn({ color }) {
    let iconSrc;
    let alt;
    if (color === COLOR.WHITE) {
        iconSrc = white;
        alt = "White Pawn";
    } else {
        iconSrc = black;
        alt = "Black Pawn";
    }
    return <img className="piece-icon" src={iconSrc} alt={alt}></img>;
}
export default Pawn;
