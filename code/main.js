const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 700;
const TIME_INTERVAL = 0.2;

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
    go("lose");
  });
}

function createGame() {
  setGravity(1600);
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
  // load a sprite "jollibee" from an image
  loadSprite("jabee", "sprites/jollibee.png");

  scene("game", () => {
    createGame();
  });

  scene("lose", () => {
    shake();
    burp();
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
