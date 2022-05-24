//import kaboom from "kaboom"

// initialize context
kaboom({
  background: [0, 0, 0],
  width: 1024,
  height: 640,
  scale: 1,
  debug: true,
});



const MATRIX_SIZE = 64;
const CELL_SIZE = 10;

// creates an array of arrays to represent the game of life matrix.
function createMatrix() {
  const matrix = new Array(MATRIX_SIZE);
  for (var i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(MATRIX_SIZE).fill(false);
  }
  return matrix;
}

function clearMatrix(matrix) {
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = false;
    }
  }
  return matrix;
}

function neighbors(matrix, x, y) {
  let count = 0;
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if (i === 0 && j === 0) {
        // this is the cell itself, do nothing
        continue;
      }
      let currentX = x + i;
      let currentY = y + j;
      if (
        currentX < 0 ||
        currentX >= MATRIX_SIZE ||
        currentY < 0 ||
        currentY >= MATRIX_SIZE
      ) {
        // this is an edge cell, do nothing
        continue;
      } else if (matrix[currentX][currentY] === true) {
        // the neighbor is alive, count it
        count++;
      }
    }
  }
  return count;
}

function updateWorld(matrix) {
  const newMatrix = createMatrix();

  // update the world
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      // check if the cell is alive
      // if it is alive, check if it has 2 or 3 neighbors
      // if it has 2 or 3 neighbors, it stays alive
      // if it has less than 2 neighbors, it dies
      // if it has more than 3 neighbors, it dies
      // if it is dead, check if it has 3 neighbors
      // if it has 3 neighbors, it becomes alive
      const cellNeighbors = neighbors(matrix, i, j);
      if (matrix[i][j] === true) {
        if (cellNeighbors === 2 || cellNeighbors === 3) {
          newMatrix[i][j] = true;
        } else {
          newMatrix[i][j] = false;
        }
      }

      if (matrix[i][j] === false) {
        if (cellNeighbors === 3) {
          newMatrix[i][j] = true;
        } else {
          newMatrix[i][j] = false;
        }
      }
    }
  }
  return newMatrix;
}

scene("game", () => {
  let pause = true;
  let updateInterval = 0.5;
  let generation = 0;
  // create the matrix
  let matrix = createMatrix();



  const pauseText = add([
    text("Paused", { size: 16, font: "sink" }),
    pos(650, 40),
    origin("left"),
    layer("ui"),
  ]);

  const speedText = add([
    text("Speed: 500ms", { size: 16, font: "sink" }),
    pos(650, 60),
    origin("left"),
    layer("ui"),
  ]);

  const generationText = add([
    text("Generation: 1", { size: 16, font: "sink" }),
    pos(650, 80),
    origin("left"),
    layer("ui"),
  ]);




  // pause
  onKeyPress("space", () => {
    pause = !pause;
  });

  // reset
  onKeyPress("r", () => {
    matrix = createMatrix();
    generation = 0;
  });

  onKeyDown("down", () => {
    updateInterval += 0.01;
  });

  onKeyDown("up", () => {
    updateInterval -= 0.01;
    updateInterval = Math.max(0.0, updateInterval);
  });

  onMousePress("left", (pos) => {
    const row = Math.floor(pos.x / CELL_SIZE);
    const col = Math.floor(pos.y / CELL_SIZE);
    if (row < 0 || col < 0 || row >= MATRIX_SIZE || col >= MATRIX_SIZE) return; 
    matrix[row][col] = true;
  });

  onMousePress("right", (pos) => {
    const row = Math.floor(pos.x / CELL_SIZE);
    const col = Math.floor(pos.y / CELL_SIZE);
    if (row < 0 || col < 0 || row >= MATRIX_SIZE || col >= MATRIX_SIZE) return; 
    matrix[row][col] = false;
  });

  let timeFromLastUpdate = 0;
  onUpdate(() => {
    if (pause) return;
    timeFromLastUpdate += dt();
    if (timeFromLastUpdate < updateInterval) return;
    timeFromLastUpdate = 0;

    generation++;
    matrix = updateWorld(matrix);
  
  });

  onDraw(() => {
    speedText.text = `Speed: ${(updateInterval * 100).toFixed(0)}ms`;
    pauseText.text = pause ? "Paused" : "Running";
    generationText.text = `Generation: ${generation}`;
    // run through the matrix and draw the cells that are alive
    for (var x = 0; x < MATRIX_SIZE; x++) {
      for (var y = 0; y < MATRIX_SIZE; y++) {
        if (matrix[x][y] === true) {
          drawCell(x, y);
        }
      }
    }
    drawGridLines();
  });
});

function drawGridLines() {
  for (var i = 0; i <= MATRIX_SIZE; i++) {
    drawLine({
      p1: vec2(i * CELL_SIZE, 0),
      p2: vec2(i * CELL_SIZE, MATRIX_SIZE * CELL_SIZE),
      width: 1,
      color: rgb(218, 165, 32),
    });

    drawLine({
      p1: vec2(0, i * CELL_SIZE),
      p2: vec2(MATRIX_SIZE * CELL_SIZE, i * CELL_SIZE),
      width: 1,
      color: rgb(218, 165, 32),
    });
  }
}

function drawCell(x, y) {
  drawRect({
    width: CELL_SIZE,
    height: CELL_SIZE,
    pos: vec2(x * CELL_SIZE, y * CELL_SIZE),
    color: rgb(100, 149, 237),
    fill: true,
    //outline: { color: WHITE, width: 1 },
  });
}

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
  ]);

  onKeyPress("space", () => {
    go("game");
  });
});

go("game");
