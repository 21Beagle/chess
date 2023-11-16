import ChessGame from '../../Chess/ChessGame/ChessGame'
import FEN from '../../Chess/FEN/FEN'
import { SlArrowLeft, SlSettings } from 'react-icons/sl'
import MovesCache from '../../Chess/MoveCache/MoveCache'
import { CgEditFlipV } from "react-icons/cg";
import './information.css'
type Props = {
    Chess: ChessGame,
    blackPlayerIsCpu: boolean,
    whitePlayerIsCpu: boolean
    undoLastMove: () => void,
    changeBlackCpu: () => void,
    changeWhiteCpu: () => void,
    flipView: () => void

}

function Information({ Chess, whitePlayerIsCpu, blackPlayerIsCpu, undoLastMove, changeBlackCpu, changeWhiteCpu, flipView }: Props) {

    const moveHistory = Chess.moveHistory.map((move, index) => {
        const className = move.piece.colour.isWhite ? "white move" : "black move";

        return (


            <div key={index} className={className}>
                {move.stateBefore.fullMoveClock}. {move.algebraicNotation}
            </div >
        );
    })


    return (
        <div className="information-wrapper" >
            <header>
                <h3>info</h3> <SlSettings />
            </header>
            <div className="previous-moves-wrapper">
                {moveHistory}
            </div>



            {/* <button onClick={() => showWhiteMoves()}>White Moves</button>
                <button onClick={() => showBlackMovesMoves()}>Black Moves</button> */}
            Black play cpu: <input type="checkbox" checked={blackPlayerIsCpu} onChange={() => changeBlackCpu()}></input>
            White player cpu: <input type="checkbox" checked={whitePlayerIsCpu} onChange={() => changeWhiteCpu()}></input>
            <SlArrowLeft onClick={() => undoLastMove()}></SlArrowLeft>

            <CgEditFlipV onClick={() => flipView()} />
            <button onClick={() => console.log(MovesCache.clearCache())}>Moves Cache</button>
            <p className="fen-string"> {FEN.generateFEN(Chess)}</p>
        </div>
    )
}

export default Information