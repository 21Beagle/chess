import ChessGame from "./src/Chess/ChessGame/ChessGame";
import Player from "./src/Chess/Player/Player";
import Search from "./src/Chess/Search/Search";


self.onmessage = (e: MessageEvent<string>) => {
    const game = new ChessGame(e.data, new Player("W", false), new Player("B", false));

    const move = Search.search(game);


    postMessage(move);
}