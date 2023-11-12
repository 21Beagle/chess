import Move from "../Move/Move";

type CacheResult = {
    result: boolean;
    moves: Move[];
}

export default class MovesCache {
    static cache: [[string, string], Move[]][] = [];



    static getMoves(pieceId: string,stateId: string): CacheResult {
        
        const resultMoves = this.cache.find(([key]) => {
            return key[0] === pieceId && key[1] === stateId;
        })?.[1];

        const result = {
            result: resultMoves !== undefined,
            moves: resultMoves !== undefined ? resultMoves : [] as Move[]
        }

        return result;
    }

    static cacheMoves(pieceId:string,moveId: string, moves: Move[]): void {
        this.cache.push([[pieceId, moveId], moves]);
    }

    static clearCache(): void {
        console.log("Clearing cache");
        this.cache = [];
    }   

}