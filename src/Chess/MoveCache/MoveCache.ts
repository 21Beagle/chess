import Move from "../Move/Move";

type CacheResult = {
    result: boolean;
    moves: Move[];
}









export default class MovesCache {
    static moveCache: Record<string, Record<string, Move[]>> = {};



    static scopeCache: Record<string, Record<string, Move[]>> = {};

    static getMoves(pieceId: string, stateId: string): CacheResult {
        try {
            const resultMoves = this.moveCache[pieceId]?.[stateId];
            const result = {
                result: resultMoves !== undefined,
                moves: resultMoves !== undefined ? resultMoves : [] as Move[]
            }
            return result;

        } catch (e) {
            console.log(e);
            return { result: false, moves: [] as Move[] };
        }
    }

    static cacheMoves(pieceId: string, stateId: string, moves: Move[]): void {
        this.moveCache = { ...this.moveCache, [pieceId]: { [stateId]: moves } }
    }

    static clearCache(): void {
        console.log("Clearing cache");
        this.moveCache = {};
    }


    static cacheScope(pieceId: string, stateId: string, moves: Move[]): void {
        this.scopeCache = { ...this.scopeCache, [pieceId]: { [stateId]: moves } }
    }

    static getScope(pieceId: string, stateId: string): CacheResult {
        try {
            const resultMoves = this.scopeCache[pieceId]?.[stateId];
            const result = {
                result: resultMoves !== undefined,
                moves: resultMoves !== undefined ? resultMoves : [] as Move[]
            }
            return result;

        } catch (e) {
            console.log(e);
            return { result: false, moves: [] as Move[] };
        }
    }

}