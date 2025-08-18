export default class Player {
  static playerId = 0;
  constructor(name) {
    this.name = name;
  }

  static create() {
    const id = ++Player.playerId;
    return new Player(Player.generateName(id));
  }

  static generateName(id) {
    let name = "";
    while (id > 0) {
      id--;
      name = String.fromCharCode((id % 26) + 65) + name;
      id = Math.floor(id / 26);
    }
    return name;
  }
}
