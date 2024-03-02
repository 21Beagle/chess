type Neighbours = {
    north: Position | null;
    south: Position | null;
    east: Position | null;
    west: Position | null;
    northEast: Position | null;
    northWest: Position | null;
    southEast: Position | null;
    southWest: Position | null;
};

export default class Position {
    private static _nullIndex: number | null = null;
    private _index: number | null = Position._nullIndex;

    constructor(input: number) {
        if (input === null) {
            return;
        }
        this._index = input;
    }

    get neighbours(): Neighbours {
        if (this.index === null) {
            return {
                north: null,
                south: null,
                east: null,
                west: null,
                northEast: null,
                northWest: null,
                southEast: null,
                southWest: null,
            };
        } else {
            return {
                north: new Position(this.index - 8),
                south: new Position(this.index + 8),
                east: new Position(this.index + 1),
                west: new Position(this.index - 1),
                northEast: new Position(this.index - 7),
                northWest: new Position(this.index - 9),
                southEast: new Position(this.index + 9),
                southWest: new Position(this.index + 7),
            };
        }
    }

    get index(): number {
        if (null === this._index) {
            throw new Error("Position index is null");
        }
        return this._index;
    }

    set index(value) {
        this._index = value;
    }

    get an(): string {
        return Position.indexToAn(this.index);
    }

    set an(value) {
        this._index = Position.anToIndex(value);
    }

    get rank(): number {
        const rank = Position.getRankOfIndex(this._index);

        if (null === this._index || rank === null) {
            throw new Error("Position rank is null");
        }

        return rank;
    }

    set rank(value) {
        this._index = Position.rankFileToIndex(value, this.file);
    }

    get file(): number {
        const file = Position.getFileOfIndex(this._index);
        if (null === this._index || file === null) {
            throw new Error("Position file is null");
        }
        return file;
    }

    set file(value) {
        this._index = Position.rankFileToIndex(this.rank, value);
    }

    static ParseAn(an: string): Position | null {
        const index = Position.anToIndex(an);
        if (index === null) {
            return null;
        }

        return new Position(index);
    }

    isEqual(position: Position): boolean {
        return this.index === position.index;
    }

    copy(): Position {
        return new Position(this.index);
    }

    static fileDifference(start: Position, end: Position) {
        if (start.file === null || end.file === null) return Infinity;
        return Math.abs(start.file - end.file);
    }

    static indexToAn(index: number | null) {
        if (index === null) {
            return "-";
        }
        const fileString = "abcdefgh";
        const file = index % 8;
        const rank = 8 - Math.floor(index / 8);
        return fileString[file] + rank;
    }

    static anToIndex(an: string): number | null {
        const fileString = "abcdefgh";
        const file = fileString.indexOf(an[0]);
        const rank = 8 - Number(an[1]);

        // a1 = 0
        // h1 = 63

        if (file === -1 || rank === -1) {
            return null;
        }

        return rank + file * 8;
    }

    static rankFileToIndex(file: number | null, rank: number | null) {
        if (rank === null || file === null) {
            return null;
        }
        return file + (7 - rank) * 8;
    }

    static getRankOfIndex(index: number | null): number | null {
        if (index === null) {
            return null;
        }
        const rank = 7 - Math.floor(index / 8);
        return rank;
    }

    static getFileOfIndex(index: number | null): number | null {
        if (index === null) {
            return null;
        }
        const file = index % 8;
        return file;
    }

    static isValidIndex(index: number | null): boolean {
        if (index === null) {
            return false;
        }
        return index >= 0 && index <= 63;
    }
}
