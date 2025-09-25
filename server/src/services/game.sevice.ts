import * as Games from "../repositories/game.repo.js";
import * as Moves from "../repositories/move.repo.js";

export async function getGameWithMoves(id: String) {
    const game = await Games.getById(id);
    if(!game) {
        return null;
    }
    const moves = await Moves.listByGame(id);
    return {game, moves};
}