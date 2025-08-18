import Game from "./game.js";
import Player from "./player.js";

const game1 = Game.create(3, 4);
const game2 = Game.create(4, 4);

const playerA = Player.create();
const playerB = Player.create();
const playerC = Player.create();
const playerD = Player.create();

game1.addPlayer(playerA);
game1.addPlayer(playerB);
game2.addPlayer(playerC);
game2.addPlayer(playerD);

game1.start();
game2.start();
