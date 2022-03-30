let socket = io();

socket.on("connect", () => {
  console.log("connected to the server", socket.id);
});

const emojis = {
  rock: "✊",
  paper: "🤚",
  scissors: "✌️",
  player: "🤖",
};

let game;
let userid = -1;
let rockX, rockY;
let emojiSize = 48;

function winlogic(a, b) {
  if (a == emojis.scissors) {
    if (b == emojis.rock) return "lose";
    else if (b == emojis.paper) return "win";
    else return "draw";
  } else if (a == emojis.rock) {
    if (b == emojis.scissors) return "win";
    else if (b == emojis.paper) return "lose";
    else return "draw";
  } else {
    if (b == emojis.scissors) return "lose";
    else if (b == emojis.rock) return "win";
    else return "draw";
  }
}

class Player {
  constructor(id) {
    this.connected = false;
    this.playing = false;
    this.emoji = "";
    this.id = id;
    this.win = "";
  }

  display() {
    if (!this.connected) {
      fill(255);
      rectMode(CENTER);
      square((this.id * width) / 3, height / 2, 250);
      textSize(emojiSize);
      fill(0);
      text("Loading...", (this.id * width) / 3, height / 2);
    } else if (this.connected && !this.playing) {
      fill(0);
      rectMode(CENTER);
      square((this.id * width) / 3, height / 2, 250);
      textSize(emojiSize * 2);
      text(emojis.player, (this.id * width) / 3, height / 2);
    } else if (this.playing) {
      fill(0);
      rectMode(CENTER);
      square((this.id * width) / 3, height / 2, 250);
      textSize(emojiSize * 2);
      text(this.emoji, (this.id * width) / 3, height / 2);
    }

    if (this.id == userid + 1 && this.win == "win") {
      textSize(emojiSize );
      fill(123,0,222);
      text("won!", (this.id * width) / 3, height / 3.5);
    } else if (this.id == userid + 1 && this.win == "lose") {
      let secondid = this.id == 1 ? 2 : 1;
      textSize(emojiSize);
      fill(123,0,222);
      text("won!", (secondid * width) / 3, height / 3.5);
    } else if (this.id == userid + 1 && this.win == "draw") {
      textSize(emojiSize);
      fill(123,0,222);
      text("draw!", width / 2, height / 3.5);
    }
    if (this.id == userid + 1 && !this.playing) {
      textSize(emojiSize / 2);
      fill(255);
      text("Choose!", (this.id * width) / 3, height / 2 + 2 * emojiSize);
    }
  }
}

class Game {
  constructor() {
    this.x = 100;
    this.players = [new Player(1), new Player(2)];
  }

  checkwin() {
    let numberofemojis = 0;
    socket.on("emojis", (emojis) => {
      numberofemojis = emojis[0] != "" && emojis[1] != "" ? 2 : 0;
      if (numberofemojis == 2 && this.x == 100) {
        console.log(emojis);
        this.players[0].emoji = emojis[0];
        this.players[1].emoji = emojis[1];
        this.players[0].playing = true;
        this.players[1].playing = true;
        this.players[0].win = winlogic(
          this.players[0].emoji,
          this.players[1].emoji
        );
        this.players[1].win = winlogic(
          this.players[1].emoji,
          this.players[0].emoji
        );
        socket.emit("end");
        this.x = 101;
        setTimeout(() => {
          this.players = [new Player(1), new Player(2)];
          game.players[0].connected = true;
          game.players[1].connected = true;
          background(125);
          this.x = 100;
        }, 3000);
      }
    });
    // console.log(numberofemojis)
  }
  display() {
    this.checkwin();
    textSize(emojiSize);
    text(emojis.rock, rockX, rockY);
    text(emojis.scissors, rockX * 1.5, rockY);
    text(emojis.paper, rockX * 2, rockY);
    this.players.forEach((element) => {
      element.display();
    });
  }
}

function setup() {
  game = new Game();
  createCanvas(windowWidth, windowHeight);
  background(125);
  textAlign(CENTER, CENTER);
  rockX = width / 3;
  rockY = height / 1.2;
  socket.on("players", (players) => {
    console.log(players.ids);
    for (let index = 0; index < players.amount; index++) {
      if (socket.id == players.ids[index]) {
        userid = index;
      }
    }
    let dummy = userid < 2 && userid == 0 ? 1 : 0;

    if (players.amount == 1) {
      game.players[0].connected = true;
      game.players[1].connected = false;
    } else if (players.amount > 1) {
      game.players[0].connected = true;
      game.players[1].connected = true;
    }

    if (userid < 2 && game.players[dummy].emoji != "") {
      game.players[dummy].playing = false;
      game.players[dummy].connected = false;
      game.players[userid].emoji = game.players[dummy].emoji;
      game.players[userid].playing = true;
      game.players[userid].connected = true;
      game.players[dummy].emoji = "";
      let sending = { id: userid, emoji: game.players[userid].emoji };
      socket.emit("emojis", sending);
      sending = { id: dummy, emoji: game.players[dummy].emoji };
      socket.emit("emojis", sending);
      console.log(userid);
    }
  });
}

function draw() {
  game.display();
}

function emojichecker(objX, objY) {
  return (
    mouseX > objX - emojiSize / 2 &&
    mouseX < objX + emojiSize / 2 &&
    mouseY > objY - emojiSize / 2 &&
    mouseY < objY + emojiSize / 2
  );
}

function mousePressed() {
  if (game && userid < 2 && game.players[userid].emoji == "") {
    if (emojichecker(rockX, rockY)) {
      game.players[userid].emoji = emojis.rock;
      game.players[userid].playing = true;
      let sending = { id: userid, emoji: game.players[userid].emoji };
      socket.emit("emojis", sending);
    } else if (emojichecker(rockX * 1.5, rockY)) {
      game.players[userid].emoji = emojis.scissors;
      game.players[userid].playing = true;
      let sending = { id: userid, emoji: game.players[userid].emoji };
      socket.emit("emojis", sending);
    } else if (emojichecker(rockX * 2, rockY)) {
      game.players[userid].emoji = emojis.paper;
      game.players[userid].playing = true;
      let sending = { id: userid, emoji: game.players[userid].emoji };
      socket.emit("emojis", sending);
    }
  }
}
