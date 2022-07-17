import React from "react";
import white from "../../Media/StandardPieces/whiteBishop.png";
import black from "../../Media/StandardPieces/blackBishop.png";

function Bishop({ color, id, handleClick }) {
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

export default Bishop;
