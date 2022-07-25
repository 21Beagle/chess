export function coordinates(arrayIndex) {
    let file = arrayIndex % 8;
    let rank = parseInt(arrayIndex / 8);
    return [file, rank];
}

export function toIndex(coordinates) {
    let rank = coordinates[0];
    let file = coordinates[1];
    return rank + file * 8;
}

export function chessNotationToIndex(moveString) {
    const fileString = "abcdefgh";
    let rank = 8 - parseInt(moveString[1]);

    let fileChar = moveString[0];
    let file = fileString.indexOf(fileChar);

    return toIndex([file, rank]);
}
