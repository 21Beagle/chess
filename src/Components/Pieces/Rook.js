import React from "react";
import white from "../../Media/StandardPieces/whiteRook.png";
import black from "../../Media/StandardPieces/blackRook.png";

function Rook({ color, id, handleClick }) {
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

export default Rook;
