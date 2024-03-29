import ChessGame from "../../Chess/ChessGame/ChessGame";
import FEN from "../../Chess/FEN/FEN";
import { SlArrowLeft, SlSettings } from "react-icons/sl";
import { CgEditFlipV } from "react-icons/cg";
import "./information.css";
type Props = {
    Chess: ChessGame;
    undoLastMove: () => void;
    flipView: () => void;
    openSettings: () => void;
};

function Information({ Chess, undoLastMove, flipView, openSettings }: Props) {
    const moveHistory = Chess.moveHistory.map((move, index) => {
        const className = move.piece.colour.isWhite ? "white move" : "black move";

        return (
            <div key={index} className={className}>
                {move.stateBefore.fullMoveClock}. {move.algebraicNotation}
            </div>
        );
    });

    return (
        <div className="information-wrapper">
            <header>
                <h3>Information</h3>{" "}
                <button className="information" onClick={() => openSettings()}>
                    <span className="information">
                        <SlSettings />
                    </span>
                </button>
            </header>
            <div className="previous-moves-wrapper">{moveHistory}</div>

            {/* <button onClick={() => showWhiteMoves()}>White Moves</button>
                <button onClick={() => showBlackMovesMoves()}>Black Moves</button> */}

            <div className="button-row">
                <button className="information" onClick={() => undoLastMove()}>
                    <span className="information">
                        <SlArrowLeft />
                    </span>
                </button>

                <button className="information" onClick={() => flipView()}>
                    <span className="information">
                        <CgEditFlipV />
                    </span>
                </button>

                <button className="information" onClick={() => console.log(Chess)}>
                    <span className="information">
                        <CgEditFlipV />
                    </span>
                </button>
            </div>

            <p className="fen-string"> {FEN.generateFEN(Chess)}</p>
        </div>
    );
}

export default Information;
