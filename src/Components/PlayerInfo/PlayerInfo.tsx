import Loader from "../Loader/Loader";
import "./PlayerInfo.css";

type Props = { isThinking: boolean; isHuman: boolean };

function PlayerInfo({ isThinking = false, isHuman = false }: Props) {
    const thinkingText = isHuman ? "It's your turn." : "I am thinking... ";

    return (
        <div className="player-info">
            <p className="thinking-text">{isThinking ? thinkingText : ""}</p>
            {!isHuman && isThinking ? <Loader></Loader> : <></>}
        </div>
    );
}

export default PlayerInfo;
