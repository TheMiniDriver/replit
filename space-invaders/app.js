//import kaboom from "kaboom"



// initialize context
kaboom({
  background: [0, 0, 0],
  width: 800,
  height: 600,
  scale: 1,
  debug: true

});


const MOVE_SPEED = 500;
const ALIEN_SPEED = 15;
const ALIEN_STEPS = 166;

const BULLET_SPEED = 300;

const BLOCK_HEIGHT = 40;
const BLOCK_WIDTH = 32;

const OFFSET_X = 208;
const OFFSET_Y = 100;

const ALIEN_ROWS = 5;
const ALIEN_COLS = 6;

loadRoot("sprites/");

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
    area()
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
          sprite("greenAlien"),
          area(),
          origin("center"),
          "alien",
          {
            row: row,
            col: col
          }
        ]);
        alienMap[row][col] = alien;
      }
    }
  }

  function addBases() {
    add([
      pos(width()/3, height() - 3*BLOCK_HEIGHT),
      rect(BLOCK_WIDTH * 3, BLOCK_HEIGHT),
      color(0,0,200),
      origin("center"),
      area(),
      solid()
    ]);
  }

  addBases();
  spawnAliens();
  
  onKeyDown("left", () => {
    player.move(-1 * MOVE_SPEED, 0)
  });

  onKeyDown("right", () => {
    player.move(MOVE_SPEED, 0)
  });

  onKeyPress("space", () => {
    spawnBullet(player.pos, -1, "bullet");
  })

  onUpdate("missile", (bullet) => {
    bullet.move(0, BULLET_SPEED * bullet.direction);
  });

  onCollide("bullet", "alien", (bullet, alien) => {
    destroy(bullet);
    destroy(alien);
    alienMap[alien.row][alien.col] = null; // Mark the alien as dead
  });

  loop(0.5, () => {
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
    debug.log(`Shooting alien at row ${row} and col ${col}`);

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