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
const LEVEL = [
"------------------------------------------"
]; 

const levelConf = {
  // grid size
  width: 16,
  height: 16,
  pos: vec2(0, 600),
  // define each object as a list of components
  "-": () => [
    rect(16,16),
    color(0,255,0),
    area(),
    solid(),
    origin("bot"),
    "ground"
  ],
};

scene("game", () => {
  let pause = false;

  const level = addLevel(LEVEL, levelConf);
  
  const player = add([
    rect( 50, 50),
    color(255,0,0),
    scale(1),
    origin("center"),
    pos(50, 550),
    area(),
    body(),
    {
      score: 0,
      lives: 3,
    },
    "player"
  ]);

  const hurdle = add([
    rect(10, 50),
    color(0,0,255),
    origin("center"),
    pos(700,550),
    area(),
    "hurdle"
  ])


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

  onKeyPress("space", () => {
    player.jump();
    // jump
  })

  player.onCollide("hurdle", (hurdle) => {
    // hitted in the knees
  });

  onUpdate(() => {
    // scroll
    every("hurdle", (hurdle) => {
      hurdle.move(-PLAYER_MOVE_SPEED,0);
    }); 

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

