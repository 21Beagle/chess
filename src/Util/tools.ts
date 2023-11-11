export function isCapital(letter :string) {
    return letter === letter.toUpperCase();
}
export function isNumeric(value : string) {
    return /^-?\d+$/.test(value);
}

export function randomElementFromArray(inputArray : []) {
    return inputArray[Math.floor(Math.random() * inputArray.length)];
}

export function removeItemFromArray(arr : [], value:never) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
