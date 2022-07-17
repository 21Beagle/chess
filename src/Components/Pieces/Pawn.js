import React from "react";
import white from "../../Media/StandardPieces/whitePawn.png";
import black from "../../Media/StandardPieces/blackPawn.png";

function Pawn({ color }) {
    let iconSrc;
    if (color === "W") {
        iconSrc = white;
    } else {
        iconSrc = black;
    }
    return <img className="piece-icon" src={iconSrc}></img>;
}
export default Pawn;
