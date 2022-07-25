import { tryMove } from "./tools";

function alphaBeta(node, depth, alpha, beta, maximizingPlayer) {
    let children = node.children;
    if (depth === 0 || children === []) return value;
    if (maximizingPlayer) {
        value = -Infinity;
        for (let child of children) {
            value = Math.max(value, alphaBeta(child, depth - 1, alpha, beta, FALSE));
            if (value >= beta) break;
            alpha = max(alpha, value);
        }
        return value;
    } else value = Infinity;
    for (let child of children) {
        value = min(value, alphaBeta(child, depth - 1, alpha, beta, TRUE));
        if (value <= alpha) break;
        beta = min(beta, value);
    }
    return value;
}

function generateTree(board, enPassant, castlePerma) {
    let children = node.children;
    if (depth === 0 || children === []) return value;
    let tree = {
        children: [],
    };
    if (maximizingPlayer) {
        for (let move in whiteMoves) {
            let newBoard = tryMove(board, move, enPassant, castlePerma);
            populateAllMoves(newBoard, enPassant, castlePerma);
            tree.push(newBoard);
        }
    }
}
