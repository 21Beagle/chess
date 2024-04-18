type Props = {
    evaluation: number;
};
import "./Evaluation.css";

export default function Evaluation({ evaluation }: Props) {
    function getEvalStyle(evaluation: number): React.CSSProperties {
        // very simple linear equation to get the height of the evaluation bar as a percentage

        // 13 is a good number her
        // if you are winning by 13 pawns you are winning by a lot and will probably win the game
        const maxEval = 13;

        const oneHundredPercent = 100;
        const zeroPercent = 0;
        const fiftyPercent = 50;

        const m = (fiftyPercent - zeroPercent) / (zeroPercent - maxEval);
        const b = fiftyPercent;
        const linearEquation = m * evaluation + b;
        const evalHeight = Math.min(Math.max(linearEquation, zeroPercent), oneHundredPercent);

        return {
            maxHeight: evalHeight + "%",
        };
    }

    const evalStyle = getEvalStyle(evaluation);

    return (
        <div className="eval-outer">
            <div className="eval-inner" style={evalStyle}>
                <div className="eval-number">{evaluation.toFixed(2)}</div>
            </div>
        </div>
    );
}
