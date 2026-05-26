const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 700;
const SPEED = 700;
const TIME_INTERVAL = 0.3;
const JABEE_SPEED = 10;

var JABEE_WIDTH;

let score = 0;

function spawnJabee() {
  // add jabee
  const jabee = add([
    sprite("jabee"),
    pos(80, height() - 200),
    area(),
    body(),
    anchor("botleft"),
  ]);

  return jabee;
}

function addScoreCounter() {
  const scoreLabel = add([text(score), pos(24, 24)]);
  onUpdate(() => {
    score++;
    scoreLabel.text = score;
  });
}

// function spawnTree() {
//   add([
//     rect(48, rand(24, 64)),
//     area(),
//     outline(4),
//     pos(width(), height() - 48),
//     anchor("botleft"),
//     color(255, 180, 255),
//     move(LEFT, SPEED),
//     "tree",
//   ]);
//   var randomTime = rand(0.5, 1.5);
//   wait(randomTime, () => {
//     spawnTree();
//   });
// }

function spawnTree(prevTime = 0) {
  add([
    rect(48, rand(24, 64)),
    area(),
    outline(4),
    pos(width(), height() - 48),
    anchor("botleft"),
    color(255, 180, 255),
    move(LEFT, SPEED),
    offscreen({ destroy: true }),
    "tree",
  ]);

  let randomTime;

  do {
    randomTime = rand(0.5, 1.5);
  } while (prevTime !== 0 && Math.abs(randomTime - prevTime) < TIME_INTERVAL);

  wait(randomTime, () => {
    spawnTree(randomTime);
  });
}

function generatePlatform() {
  // add platform
  const mainPlatform = add([
    rect(width(), 48),
    pos(0, height() - 48),
    outline(4),
    area(4),
    body({ isStatic: true }),
    color(127, 200, 255),
  ]);
}

function addGameEventListeners(jabee) {
  onKeyPress("space", () => {
    if (jabee.isGrounded()) {
      jabee.jump();
    }
  });

  jabee.onCollide("tree", () => {
    addKaboom(jabee.pos);
    destroy(jabee);
    go("lose");
  });

  const JABEE_WIDTH = jabee.width;

  onUpdate(() => {
    const left = isKeyDown("a");
    const right = isKeyDown("d");
    const down = isKeyDown("s");
    const up = isKeyDown("w");

    if (left) {
      // if (jabee.pos.x < 0) jabee.pos.x = 0;
      if (!(jabee.pos.x - JABEE_SPEED < 0)) {
        jabee.pos.x -= JABEE_SPEED;
      }
    } else if (right) {
      jabee.pos.x += JABEE_SPEED;
    }
    // else if (down) {
    //   jabee.pos.y -= JABEE_SPEED;
    // } else if (right) {
    //   jabee.pos.y += JABEE_SPEED;
    // }
    else {
      console.log("IDLE");
    }
  });
}

function addBackground() {
  add([
    sprite("jabee-store", { width: width(), height: height() }), // Stretch to fit screen
    pos(0, 0),
    fixed(),
  ]);
}

function createGame() {
  setGravity(1600);
  addBackground();
  generatePlatform();
  const jabee = spawnJabee();
  spawnTree();
  addScoreCounter();
  addGameEventListeners(jabee);
}

window.addEventListener("load", () => {
  kaboom({
    background: [0, 0, 255],
  });
  // kaboom();
  // load a sprite "jollibee" from an image
  loadSprite("jabee", "sprites/jollibee.png");
  loadSprite("jabee-store", "sprites/jabee-store.jpg");

  scene("game", () => {
    createGame();
  });

  scene("lose", () => {
    shake();
    // burp();
    addBackground();
    add([
      sprite("jabee"),
      pos(width() / 2, height() / 2 - 80),
      scale(2),
      anchor("center"),
    ]);

    // display score
    add([
      text(score),
      pos(width() / 2, height() / 2 + 80),
      scale(2),
      anchor("center"),
    ]);

    score = 0;

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));
  });

  go("game");
});
