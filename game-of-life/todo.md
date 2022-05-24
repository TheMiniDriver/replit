# Game of Life

### Code
[x] Get template going
[x] Render cells
[x] Model the world with an array of cells
[x] Create the rules
[x] add in grid lines to see the cells
[x] add in toggle to start / stop simulation
[x] add in click to update cell state
  [x] right click to clear cell
[x] add in run / pause state
[x] add in current speed
[x] add generation count
[ ] Record some common patterns
  [ ] rotator
  [ ] slider
  [ ] generator

## Article

[ ] Game background
  [ ] Created by John Conway in 1970 during coffee breaks. Originally played without a computer (were not many around then), on a Go board manually. [ ] go Board picture. Rules were experimented with and tweaked until the most interesting properties emerged. 
  Game is played on a grid, with each grid cell having a state of either alive or dead.

[ ] Game rules. 
  [ ] Any live cell with fewer than two live neighbours dies, as if caused by under-population. 
  [ ] Any live cell with two or three live neighbours lives on to the next generation, healthy population.
  [ ] Any live cell with more than three live neighbours dies, as if by overcrowding. 
  [ ] Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

[ ] Modelling in code
2D array for our grid, or matrix represenation. No native concept in Javascript, but we can use an array of arrays. 
Some functions to create and manipulate the model. 
Create a new matrix. 
Clear out a matrix. 
Apply the rules to the matrix, and return the next generation. 

[ ] Drawing the grid
Kaboom proovides diriect drawing functions to draw onto the canvas. It also has an `onDraw` event which runs each frame, just before the screen is redrawn. Coupled with the onUpdate event, we can update the model and redraw it each frame. 
This might go too fast to see each change, so we can add some code to see the time since the last update. Kaboom provides a handy function `dt()` which return the time since the last frame was drawn. 

[ ] Adding controls and info
We'll need a few controls:
- Start / stop the simulation
- Change the speed
- Set/ clear a cell's state to create starting patterns. 
- Display the current generation. 

Kaboom has many functions to deal with user input. We'll use the `onMousePress` and `onKeyPress` events to implement the controls. 

[ ] Creating the rules