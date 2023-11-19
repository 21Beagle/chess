
import { useState } from 'react';
import ChessGame from '../../Chess/ChessGame/ChessGame'
import Search from '../../Chess/Search/Search';

type Props = {
    chess: ChessGame
}

function GameSettings({ chess }: Props) {
    const [whitePlayerIsCpu, setWhitePlayerIsCpu] = useState(chess.whitePlayer.isCpu);
    const [blackPlayerIsCpu, setBlackPlayerIsCpu] = useState(chess.blackPlayer.isCpu);
    const [depth, setDepth] = useState(Search.depth);


    function changeWhiteCpu() {
        chess.whitePlayer.isHuman = !chess.whitePlayer.isHuman;
        setWhitePlayerIsCpu(() => chess.whitePlayer.isCpu);
        setBlackPlayerIsCpu(() => chess.blackPlayer.isCpu);
    }

    function changeBlackCpu() {
        chess.blackPlayer.isHuman = !chess.blackPlayer.isHuman;
        setWhitePlayerIsCpu(() => chess.whitePlayer.isCpu);
        setBlackPlayerIsCpu(() => chess.blackPlayer.isCpu);
    }

    function changeDepth(newDepth: number) {
        Search.depth = newDepth;
        setDepth(() => Search.depth);
    }





    return (
        <div>
            <div className='setting'>
                <div className='setting-label'>
                    Black player CPU:
                </div>
                <input type="checkbox" checked={blackPlayerIsCpu} onChange={() => changeBlackCpu()}></input>
            </div>
            <div className='setting'>
                <div className='setting-label'>
                    White player CPU:
                </div>
                <input type="checkbox" checked={whitePlayerIsCpu} onChange={() => changeWhiteCpu()}></input>
            </div>
            <div className='setting'>
                <div className='setting-label'>

                    CPU Search Depth:
                </div>
                <input type="range" min={1} max={4} value={depth} onChange={(e) => changeDepth(parseInt(e.target.value))}></input>{Search.depth}
            </div>
        </div>
    )
}

export default GameSettings