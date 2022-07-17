import React from "react";
import white from "../../Media/StandardPieces/whitePawn.png";
import black from "../../Media/StandardPieces/blackPawn.png";

function Pawn({ color, id, handleClick }) {
    let iconSrc;
    if (color === "W") {
        iconSrc = white;
    } else {
        iconSrc = black;
    }
    return (
        <img
            onClick={() => handleClick(id)}
            className="piece-icon"
            src={iconSrc}
        ></img>
    );
}
export default Pawn;
