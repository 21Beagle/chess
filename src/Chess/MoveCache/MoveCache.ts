import Move from "../Move/Move";

type CacheResult = {
    result: boolean;
    moves: Move[];
}

export default class MovesCache {
    static moveCache: [[string, string], Move[]][] = [];

    static scopeCache: [[string, string], Move[]][] = [];

    static getMoves(pieceId: string, stateId: string): CacheResult {



        const resultMoves = this.moveCache.find(([key]) => {
            return key[0] === pieceId && key[1] === stateId;
        })?.[1];

        const result = {
            result: resultMoves !== undefined,
            moves: resultMoves !== undefined ? resultMoves : [] as Move[]
        }

        return result;
    }

    static cacheMoves(pieceId: string, moveId: string, moves: Move[]): void {
        this.moveCache.push([[pieceId, moveId], moves]);
    }

    static clearCache(): void {
        console.log("Clearing cache");
        this.moveCache = [];
    }


    static cacheScope(pieceId: string, stateId: string, moves: Move[]): void {
        this.scopeCache.push([[pieceId, stateId], moves]);
    }

    static getScope(pieceId: string, stateId: string):
        CacheResult {
        const resultMoves = this.scopeCache.find(([key]) => {
            return key[0] === pieceId && key[1] === stateId;
        })?.[1];

        const result = {
            result: resultMoves !== undefined,
            moves: resultMoves !== undefined ? resultMoves : [] as Move[]
        }

        return result;
    }

}