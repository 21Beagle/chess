import "./PlayerInfo.css";

type Props = { isThinking: boolean; isHuman: boolean };

function PlayerInfo({ isThinking = false, isHuman = false }: Props) {
    const thinkingText = isHuman ? "It's your turn." : "The bot is thinking...";

    return <div className="player-info">{isThinking ? thinkingText : ""}</div>;
}

export default PlayerInfo;
