import React from "react";
import { COLOR, STALEMATE } from "../../Consts/Consts";
import "./WinScreen.css";

function WinScreen({ reset, whoWon }) {
    let text = "";
    switch (whoWon) {
        case COLOR.BLACK:
            text = "Black won!";
            break;
        case COLOR.WHITE:
            text = "White won!";
            break;
        case STALEMATE:
            text = "Draw!";
            break;
        default:
            break;
    }

    return (
        <div className="win-screen">
            <div className="win-text center">{text}</div>
            <div className="reset-btn-container center" onClick={() => reset()}>
                <button className="reset-btn center"> Reset?</button>
            </div>
        </div>
    );
}

export default WinScreen;
