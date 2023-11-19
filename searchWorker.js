


self.onmessage = (e) => {
    if (!e.data) {
        return;
    }
    const game = new ChessGame(e.data, new Player("W", false), new Player("B", false));

    const move = Search.search(game);


    postMessage(move);
}