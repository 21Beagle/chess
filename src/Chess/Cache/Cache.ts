import Move from "../Move/Move";

type MoveResult = {
    result: boolean;
    moves: Move[];
};

type evaluationResult = {
    result: boolean;
    evaluation: number;
};

export default class Cache {
    static moveCache: Record<string, Record<string, Move[]>> = {};

    static scopeCache: Record<string, Record<string, Move[]>> = {};

    static evalCache: Record<string, number> = {};

    static getMoves(pieceId: string, stateId: string): MoveResult {
        try {
            const resultMoves = this.moveCache[pieceId]?.[stateId];
            const result = {
                result: resultMoves !== undefined,
                moves: resultMoves !== undefined ? resultMoves : ([] as Move[]),
            };
            return result;
        } catch (e) {
            console.log(e);
            return { result: false, moves: [] as Move[] };
        }
    }

    static cacheMoves(pieceId: string, stateId: string, moves: Move[]): void {
        this.moveCache[pieceId] = { [stateId]: moves };
    }

    static clearCache(): void {
        console.log("Clearing cache");
        this.moveCache = {};
        this.evalCache = {};
        this.scopeCache = {};
    }

    static clearEvaluationCache(): void {
        this.evalCache = {};
    }

    static cacheScope(pieceId: string, stateId: string, moves: Move[]): void {
        this.scopeCache[pieceId] = { [stateId]: moves };
    }

    static getScope(pieceId: string, stateId: string): MoveResult {
        try {
            const resultMoves = this.scopeCache[pieceId]?.[stateId];
            const result = {
                result: resultMoves !== undefined,
                moves: resultMoves !== undefined ? resultMoves : ([] as Move[]),
            };
            return result;
        } catch (e) {
            console.log(e);
            return { result: false, moves: [] as Move[] };
        }
    }

    static getEvaluation(position: string): evaluationResult {
        try {
            const evaluation = this.evalCache[position];
            if (evaluation !== undefined) {
                const result = {
                    result: true,
                    evaluation: evaluation,
                };
                return result;
            }
            return { result: false, evaluation: 0 };
        } catch (e) {
            return { result: false, evaluation: 0 };
        }
    }

    static cacheEvaluation(position: string, evaluation: number) {
        this.evalCache[position] = evaluation;
    }
}
