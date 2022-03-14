//import kaboom from "kaboom"

// initialize context
kaboom({
  background: [0, 0, 0],
  width: 800,
  height: 600,
  scale: 1,
  debug: true

});


const PLAYER_MOVE_SPEED = 500;
const ALIEN_SPEED = 15;
const ALIEN_STEPS = 322;

const BULLET_SPEED = 300;

const BLOCK_HEIGHT = 40;
const BLOCK_WIDTH = 32;

const OFFSET_X = 208;
const OFFSET_Y = 100;

const ALIEN_ROWS = 5;
const ALIEN_COLS = 6;

const POINTS_PER_ALIEN = 10;

const SCREEN_EDGE = 100;

const GUN_COOLDOWN_TIME = 1;


loadRoot("sprites/");
loadSpriteAtlas("invaderMac.png", {
  "alien": {
    "x": 0,
    "y": 0,
    "width": 48,
    "height": 12,
    "sliceX": 4,
    "sliceY": 1,
    "anims": {
      "fly": { from: 0, to: 1, speed: 4, loop: true },
      "explode": { from: 2, to: 3, speed: 8, loop: true }
    }
  }
});

loadSprite("player", "player.png");
loadSprite("greenAlien", "green.png");
loadSprite("redAlien", "red.png");
loadSprite("yellowAlien", "yellow.png");
loadSprite("bossAlien", "extra.png");


scene("game", () => {

  const player = add([
    sprite("player"),
    scale(1),
    origin("center"),
    pos(50, 550),
    area(),
    {
      score: 0,
      lives: 3,
    },
    "player"
  ]);

  let alienMap = [];
  function spawnAliens() {
    for (let row = 0; row < ALIEN_ROWS; row++) {
      alienMap[row] = [];
      for (let col = 0; col < ALIEN_COLS; col++) {

        const x = (col * BLOCK_WIDTH * 2) + OFFSET_X;
        const y = (row * BLOCK_HEIGHT) + OFFSET_Y;
        const alien = add([
          pos(x, y),
          sprite("alien"),
          area(),
          scale(4),
          origin("center"),
          "alien",
          {
            row: row,
            col: col
          }
        ]);
        alien.play("fly");
        alienMap[row][col] = alien;
      }
    }
  }

  function addBases() {
    add([
      pos(width() / 3, height() - 3 * BLOCK_HEIGHT),
      rect(BLOCK_WIDTH * 3, BLOCK_HEIGHT),
      color(0, 0, 200),
      origin("center"),
      area(),
      solid()
    ]);
  }

  //addBases();
  spawnAliens();

  add([
    text("SCORE:", { size: 20, font: "sink" }),
    pos(100, 40),
    origin("center"),
    layer("ui"),
  ]);

  const scoreText = add([
    text("000000", { size: 20, font: "sink" }),
    pos(200, 40),
    origin("center"),
    layer("ui"),
  ]);


  add([
    text("LIVES:", { size: 20, font: "sink" }),
    pos(650, 40),
    origin("center"),
    layer("ui"),
  ]);

  const livesText = add([
    text("3", { size: 20, font: "sink" }),
    pos(700, 40),
    origin("center"),
    layer("ui"),
  ]);

  function updateScore(points) {
    player.score += points;
    scoreText.text = player.score.toString().padStart(6, "0");
  }

  function updateLives(life) {
    player.lives += life;
    livesText.text = player.lives.toString();
  }

  onKeyDown("left", () => {
    if (player.pos.x >= SCREEN_EDGE) {
      player.move(-1 * PLAYER_MOVE_SPEED, 0)
    }
  });

  onKeyDown("right", () => {
    if (player.pos.x <= width() - SCREEN_EDGE) {
      player.move(PLAYER_MOVE_SPEED, 0)
    }
  });

  let lastShootTime = time();
  onKeyPress("space", () => {
    console.log(time());
    if (time() - lastShootTime > GUN_COOLDOWN_TIME) {
      lastShootTime = time();
      spawnBullet(player.pos, -1, "bullet");
    }
  })

  onUpdate("missile", (bullet) => {
    bullet.move(0, BULLET_SPEED * bullet.direction);
  });

  onCollide("bullet", "alien", (bullet, alien) => {
    destroy(bullet);
    alien.play('explode');
    alien.use(lifespan(0.5, { fade: 0.1 }));
    alienMap[alien.row][alien.col] = null; // Mark the alien as dead
    updateScore(POINTS_PER_ALIEN);
  });

  player.onCollide("missile", (missile) => {
    destroy(missile);
    updateLives(-1);
  });

  loop(1, () => {
    // Randomly choose a column, then walk up from the
    // bottom row until an alien that is still alive is found

    let row, col;
    col = randi(0, ALIEN_COLS);
    let shooter = null;

    // Look for the first alien in the column that is still alive
    for (row = 4; row >= 0; row--) {
      shooter = alienMap[row][col];
      if (shooter != null) {
        break;
      }
    }
    if (shooter != null) {
      spawnBullet(shooter.pos, 1, "alienBullet");
    }

  });

  function spawnBullet(bulletPos, direction, tag) {
    add([
      rect(2, 6),
      pos(bulletPos),
      origin("center"),
      color(255, 255, 255),
      area(),
      cleanup(),
      "missile",
      tag,
      {
        direction
      }
    ]);
  }

  let alienDirection = 1;
  let alienMoveCounter = 0;

  onUpdate(() => {
    every("alien", (alien) => {
      alien.move(alienDirection * ALIEN_SPEED, 0);
    });

    alienMoveCounter++;
    if (alienMoveCounter > ALIEN_STEPS) {
      alienDirection = alienDirection * -1;
      alienMoveCounter = 0;
      moveAliensDown();
    }
  });

  function moveAliensDown() {
    every("alien", (alien) => {
      alien.moveTo(alien.pos.x, alien.pos.y + BLOCK_HEIGHT, 500);
    });
  }

});


go("game");