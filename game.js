export default class Game {
  static gameId = 0;

  constructor(m, n) {
    if (m <= 0 || n <= 0 || m * n < 2) throw new Error("Invalid dimensions");
    this.id = ++Game.gameId;
    this.rows = m;
    this.cols = n;
    this.turn = 1;

    this.grid = Array.from({ length: m }, () => Array(n).fill("_"));

    this.availableCells = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.availableCells.push([i, j]);
      }
    }

    this.destination = this.getEmptyCell();
    this.grid[this.destination[0]][this.destination[1]] = "X";

    this.players = new Map();
    this.interval = null;
  }

  static create(m, n) {
    return new Game(m, n);
  }

  getEmptyCell() {
    if (this.availableCells.length === 0)
      throw new Error("No empty cells left");
    const index = Math.floor(Math.random() * this.availableCells.length);
    return this.availableCells.splice(index, 1)[0];
  }

  addPlayer(player) {
    if (this.players.size >= this.rows * this.cols - 1)
      throw new Error("Game full");

    const [x, y] = this.getEmptyCell();
    this.players.set(player.name, [x, y]);
    this.grid[x][y] = player.name;
  }

  start() {
    this.print();

    this.interval = setInterval(() => {
      this.turn++;
      const newPositions = new Map();
      const collisionMap = new Map();

      for (const [name, [x, y]] of this.players.entries()) {
        const dx = Math.sign(this.destination[0] - x);
        const dy = Math.sign(this.destination[1] - y);
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;

        if (!collisionMap.has(key)) collisionMap.set(key, []);
        collisionMap.get(key).push(name);
        newPositions.set(name, [nx, ny]);
        this.grid[x][y] = "_";
      }

      for (const [key, names] of collisionMap.entries()) {
        if (names.length === 1) {
          const name = names[0];
          const [x, y] = newPositions.get(name);
          this.players.set(name, [x, y]);
          this.grid[x][y] = name;

          if (x === this.destination[0] && y === this.destination[1]) {
            this.print();
            console.log(`Game ${this.id.toString().padStart(2, "0")} ended`);
            console.log(`Winner: ${name}\n`);
            clearInterval(this.interval);
            return;
          }
        } else {
          for (const name of names) {
            console.log(
              `Player ${name} eliminated due to collision at position ${key}\n`
            );
            this.players.delete(name);
          }
        }
      }

      this.print();

      if (this.players.size === 0) {
        console.log(`Game ${this.id.toString().padStart(2, "0")} ended`);
        console.log(`All players eliminated\n`);
        clearInterval(this.interval);
      }
    }, 5000);
  }

  print() {
    console.log(
      `Game ${this.id.toString().padStart(2, "0")}  Turn ${this.turn
        .toString()
        .padStart(3, "0")}\n`
    );
    for (const row of this.grid) {
      console.log(
        row
          .map((cell) => (cell === "_" ? " . " : ` ${cell.padEnd(1, " ")} `))
          .join("")
      );
    }
    console.log();
  }
}
