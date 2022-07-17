import React from "react";
import white from "../../Media/StandardPieces/whiteQueen.png";
import black from "../../Media/StandardPieces/blackQueen.png";

function Queen({ color, id, handleClick }) {
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

export default Queen;
