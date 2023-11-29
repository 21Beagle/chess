import ChessGame from "./Chess/ChessGame/ChessGame.ts";
import Player from "./Chess/Player/Player.ts";
import Search from "./Chess/Search/Search.ts";

self.onmessage = (e) => {
    if (!e.data) {
        return;
    }
    const game = new ChessGame(e.data, new Player("W", false), new Player("B", false));

    const move = new Search(game).search();

    postMessage(move);
};

export default {};
