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
let GAME_SPEED = 100;
const SPEED_INCREASE = 0.5;


loadRoot("sprites/");

scene("game", () => {
  let pause = false;

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
  player.play('move');


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



  function updateScore(points) {
    player.score += points;
    scoreText.text = player.score.toString().padStart(6, "0");
  }


  onKeyDown("left", () => {
    if (pause) return; 
    if (player.pos.x >= SCREEN_EDGE) {
      player.move(-1 * PLAYER_MOVE_SPEED, 0)
    }
  });

  onKeyDown("right", () => {
    if (pause) return; 
    if (player.pos.x <= width() - SCREEN_EDGE) {
      player.move(PLAYER_MOVE_SPEED, 0)
    }
  });

  onKeyPress("space", () => {
    // jump
  })

  player.onCollide("hurdle", (hurdle) => {
    // hitted in the knees
  });

  onUpdate(() => {
    // scroll
  });


});

scene("gameOver", (score) => {

  add([
    text("GAME OVER", { size: 40, font: "sink" }),
    pos(width() / 2, height() / 2),
    origin("center"),
    layer("ui"),
  ]);

  add([
    text("SCORE: " + score, { size: 20, font: "sink" }),
    pos(width() / 2, height() / 2 + 50),
    origin("center"),
    layer("ui"),
  ])

  onKeyPress("space", () => {
    go("game");
  });

});

go("game");

