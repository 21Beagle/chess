import React from "react";
import white from "../../Media/StandardPieces/whiteKing.png";
import black from "../../Media/StandardPieces/blackKing.png";

function King({ color, id, handleClick }) {
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

export default King;
