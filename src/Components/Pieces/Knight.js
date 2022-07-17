import React from "react";
import white from "../../Media/StandardPieces/whiteKnight.png";
import black from "../../Media/StandardPieces/blackKnight.png";

function Knight({ color, id, handleClick }) {
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

export default Knight;
