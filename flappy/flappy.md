# Flappy Bird

Flappy Bird was a smash hit game for mobile phones back in 2013 - 2014. The inspiration behind the app was the challenge of bouncing a ping pong ball on a paddle for as long as possible without letting it drop to the ground or shoot off into the air.   At the peak of its success, the game creator suddenly removed it from all app stores, saying that he felt guilty that the game had become addictive for many people. In the wake of the removal, many clones were made to fill the gap left by the original Flappy Bird. After a few months, the original author released some new versions of the game again. 

Let's take a trip back to 2014, and create our own clone of Flappy Bird using Kaboom! By remaking a game, not only can you learn how to make games, but you can also extend and change the game as you like. 

This article is based on a [video tutorial](https://www.youtube.com/watch?v=hgReGsh5xVU). There are a few small differences - mainly the Flappy assets (graphics and sound) are no longer available by default in the Replit Kaboom asset library. That's OK, because we've included them in a download [here](flappy-assets.zip), so you can still use them.


## Creating a new project in Replit

Head over to [Replit](https://replit.com) and create a new repl. Choose **Kaboom** as your project type. Now, give this repl a name, like "Flappy!".

After the repl has booted up, you should see a `main.js` file under the "Scenes" section. This is where we'll start coding. It already has some code in, but we'll replace that. 

Download [all these sprites and asset files](flappy-assets.zip) needed for the game, and unzip them on your computer. In the Kaboom editor, click the "Files" icon in the side bar. Now drag and drop all the sprite files (image files) into the "sprites" folder, and all the sounds (mp3 files) in to the "sounds" folder. Once they have uploaded, you can click on the "Kaboom" icon in the side bar, and return to the "main" code file.

## Initializing Kaboom

In the "main" code file, first delete all the example code. Now we can add reference to Kaboom, and initialize it:

```js
import kaboom from "kaboom";

kaboom();

```

Now, let's import the game assets (graphics and sound). To do this, we'll use the [`loadSprite`](https://kaboomjs.com/#loadSprite) and [`loadSound`](https://kaboomjs.com/#loadSound) functions:

```js
loadSprite("birdy", "sprites/birdy.png");
loadSprite("bg", "sprites/bg.png");
loadSprite("pipe", "sprites/pipe.png");
loadSound("wooosh", "sounds/wooosh.mp3");
```

The first argument in the `load..` function is the name we want to refer to the asset later on in code. The second parameter is the location of the asset to load. 

## Adding scenes

[Scenes](https://kaboomjs.com/#scene) are like different stages in a kaboom game. Generally, there are normally 3 scenes in games:

- The intro scene, which gives some info and instructions, and waits for the player to press "start"
- The main game, where we play.
- An endgame, or game over scene, which gives the player their score or overall result, and allows them to start again. 

For this tutorial, we'll omit the intro scene, since we already know what Flappy bird is and how to play it. Feel free to add your own intro scene in later though!

![game scenes](game-scenes.png)

Let's add the code for defining each scene: 

```js
scene("game", () => {

	// todo.. add scene code here
});


scene("gameover", (score) => {

	// todo.. add scene code here	
});


go("game")
```

Notice in the `gameover` scene definition, we add a custom parameter `score`. This is so we can pass the player's final score to the end game scene to display it. 

To start the whole game off, we use the [`go`](https://kaboomjs.com/#go) function, which switches between scenes. 

## Building the game world

Now that we have all the main structure and overhead functions out of the way, let's start adding in the characters that make up the Flappy world. In Kaboom, characters are anything that makes up the game world, including floor, platforms etc, and not only the players and bots. They are also known as "game objects". 

We'll start with the background, using the `bg.png` image we added. Add this code to the `game` scene section: 

```js
add([
	sprite("bg", {width: width(), height: height()})
]);
```

This uses the the [`add`](https://kaboomjs.com/#add) function to add a new character to the scene. The `add` function takes an array of components that make up the look and behavior of a game character.  In Kaboom, every character is made up of 1 or more components. Components give special properties to each character. There are built-in components for many properties, like [`sprite`](https://kaboomjs.com/#sprite) to give the character an avatar, [`body`](https://kaboomjs.com/#body), which makes the character respond to gravity, [`solid`](https://kaboomjs.com/#solid) which makes the character solid, so other characters can't move through it, and many others.

Since the background doesn't need to do much, just stay in the back and look pretty, we only use the [`sprite`](https://kaboomjs.com/#sprite) component, which displays an image. The `sprite` component takes the name of the sprite, which we set when we loaded the sprite earlier, and optionally the width and height that it should be displayed on the screen. Since we want the background to cover the whole screen, we need to set the `width` and `height` of the sprite to the width and height of the window that our game is running in. Kaboom provides the [`width()`](https://kaboomjs.com/#width) and ['height()'](https://kaboomjs.com/#height) functions to get the window dimensions. 

If you press the "Play" button at the top of your repl, you should see the background of the Flappy world come up in the output section of the repl: 

![Flappy background with buildings, trees and building sky line](flappy-background.png)


Great! Now let's add in the Flappy Bird. Add this code to the `game` scene:

```js
const player = add([
	// list of components
	sprite("birdy"),
	scale(2),
	pos(80, 40),
	area(),
	body(),
]);
```

This is using the same [`add`](https://kaboomjs.com/#add) function we used for adding in the background. This time, we grab a reference, `const player` to the returned game object. This is so we use this reference later when checking for collisions, or flapping up when the player taps the space bar. 

You'll also notice that the character we are adding here has many more components than just the [`sprite`](https://kaboomjs.com/#sprite) component we used for the background. We already know what the `sprite` component does - here is what the rest are for:

- [`scale`](https://kaboomjs.com/#scale) makes the sprite larger on screen by drawing at `2` times the sprite's image normal size. This gives a nice pixelated look, while also making it easier to spot the bird. 
- [`pos`](https://kaboomjs.com/#pos) sets the position on the screen that the character should initially be at. This takes the x and y coordinate to specify the position. 
- [`area`](https://kaboomjs.com/#area) gives the sprite an invisible bounding box around it, which is used when calculating and detecting collisions between characters. We'll need this so that we can detect if Flappy flies into the pipes. 
- [`body`](https://kaboomjs.com/#body) makes the character subject to gravity. This means Flappy will fall out of the sky if the player doesn't do anything. We'll make Flappy be able to fly next. 


You can press `command + s` (mac) or `control + s` (Windows/Linux) to update the game output window. You should see Flappy added and fall out of the sky very quickly:

![flappy falling out of the sky](flappy-falls.gif)

## Making Flappy fly

Our next task is save Flappy from plummeting to their death by giving a control to the player to flap Flappy's wings. We'll use the spacebar for this. Kaboom has an [`onKeyPress`](https://kaboomjs.com/#onKeyPress) function, which fires a callback with custom code when the specified key is pressed. Add this code to the `game` scene make Flappy fly when the `space` key is pressed. 


```js
onKeyPress("space", () => {
	play("wooosh");
	player.jump(400);
});
```
In the callback handler, we first [`play`](https://kaboomjs.com/#play) a sound of flapping wings to give the player feedback and add some interest to the game. Then we use the [`jump`](https://kaboomjs.com/#body) method, which is added to our player character through the [`body`](https://kaboomjs.com/#body) component we added earlier. The `jump` function makes a a character accelerate up sharply. We can adjust just how sharp and high the jump should be through the number we pass as an argument to the jump method - the larger the number, the higher the jump. Although Flappy is technically not jumping (you normally need to be on a solid surface to jump), it still has the effect we need. 

You can press `command + s` (mac) or `control + s` (Windows/Linux) to update the game output window. Now if you press "space", you'll be able to keep Flappy in the air!

![flying-flappy](flappy-fly.gif)


## Adding in the pipes

Now we can get to the main part of the game - adding in the moving pipes that Flappy needs to fly through. 

Here is a diagram of the layout of the pipes in the game. We want to move the pipe gap, and therefore the pipes, up and down for each new pipe pair that gets created. This is so we don't just have the gap at the center point of the screen constantly - we want it to be slightly different for each pipe pair that comes along. We do want to keep the gap consistent though. 

![pipe layout and gap](pipe-gap.png)


Let's start with the case of having the pipe gap in the center of the screen. We'll give the pipe gap a size `PIPE_GAP`. Then to place the pipes, the bottom of the upper pipe should be `PIPE_GAP/2` pixels above the center point of the window, which is `height()/2`. Likewise, the top of the lower pipe should be `PIPE_GAP/2` pixels below the center point of the window, again which is `height()/2`. 

This gives us the placement of the pipe so that the pipe gap is dead in the center of the window. Now, we want to randomly move this up or down for each new pair of pipes that come along. One way to do this is to create a random offset, which we can add to the mid-point, which will effectively move the mid-point of the window up or down. We can use the Kaboom [`rand`](https://kaboomjs.com/#rand) function to do this. [`rand`](https://kaboomjs.com/#rand) has 2 parameters to specify the range in which the random number should be. 

Now, putting that all together, the y-position of the lower pipe can be calculated as:

`height()/2 + offset + PIPE_GAP/2 `

Remember, the top of the window is `y=0`, and the bottom is `y=height()`, i.e the lower down on the screen, the higher the `y` coordinate. 

For the upper pipe, we can calculate the point where the bottom of the pipe should be:

`height()/2 + offset - PIPE_GAP/2`


Kaboom has a component [`origin`](https://kaboomjs.com/#origin) that sets which point of a character is used as its origin. By default, the top left (`topleft`) is used, which works well for our lower pipe, as our calculations above are calculating for that point. However, for the upper pipe, our calculations are for the _bottom_ of the pipe. Therefore, we can use the [`origin`](https://kaboomjs.com/#origin) component to specify that. 

Since we want the pipes to come from the right of the screen toward the left, where Flappy is, we'll start their x-position to be the [`width()`](https://kaboomjs.com/#width) of the screen. 

To identify and be able to query the pipes later, we can also add a text tag `"pipe"` to them. 

Finally, since we will need to create many pipes during the game, let's wrap all the pipe code in a function that we will be able to call at regular intervals to make the pipes. 

Here is the code from all those considerations and calculation. Insert this code to the `game` scene:

```js

const PIPE_GAP = 120;

function producePipes(){
	const offset = rand(-50, 50);

	add([
	  sprite("pipe"),
	  pos(width(), height()/2 + offset + PIPE_GAP/2),
	  "pipe",
	  area(),
	]);

	add([
	  sprite("pipe", {flipY: true}),
	  pos(width(), height()/2 + offset - PIPE_GAP/2),
	  origin("botleft"),
	  "pipe",
	  area()
	]);
}
```

Now, we need to do a few more things to make the pipes appear and move. 

To move the pipes across the screen, we can use the [`onUpdate`](https://kaboomjs.com/#onUpdate) function to update all pipes position each frame. Note that we only need to adjust the `x` position of the pipe. Add this code to the `game` scene part of the code. 

```js
onUpdate("pipe", (pipe) => {
	pipe.move(-160, 0);
});
```

Now lets generate pipes at a steady rate. We can use the [`loop`](https://kaboomjs.com/#loop) function for this. Add the following to the `game` scene part of the code. 

```js
loop(1.5, () => {
	producePipes();
});
```
This calls our `producePipes()` function every `1.5` seconds. You can adjust this rate, or make it variable to increase it as the game progresses if you like. 

Press `command + s` (mac) or `control + s` (Windows/Linux) to update the game output window. You should see the pipes generated and moving across the screen. You can also fly Flappy, although crashing into the pipes does nothing for now.

![moving pipes](moving-pipes.gif)

Flappy is flapping and the pipes are piling on. Next tasks are to detect when Flappy flies past a pipe, increasing the player's score, and when Flappy flies into a pipe, unfortunately getting knocked out and ending the game. We'll do the good case first. 

## Adding in scoring 

 Now let's detect when Flappy flies past a pipe, and increment the player's score. To do this, we'll need to keep track of which pipes have gone passed Flappy. Kaboom allows us to add custom properties to a character. Modify the pipe generating function `producePipes` to add a custom property called `passed` to the pipes. It should look like this now:

```js
function producePipes() {
	const offset = rand(-50, 50);

	add([
	  sprite("pipe"),
	  pos(width(), height() / 2 + offset + PIPE_GAP / 2),
	  "pipe",
	  area(),
	  {passed: false}
	]);

	add([
	  sprite("pipe", { flipY: true }),
	  pos(width(), height() / 2 + offset - PIPE_GAP / 2),
	  origin("botleft"),
	  "pipe",
	  area(),
	]);
}
```


Next, we'll add in a variable to track the `score`, and a text element to display it on screen. Add this code to the `game` scene:

```js
let score = 0;
const scoreText = add([
	text(score, {size: 50})
]);
```

Now we can modify the `onUpdate()` event handler we created earlier for moving the pipes. We'll check if any pipes have moved past Flappy, and update their `passed` flag so we don't count them more than once. We'll only add the `passed` flag to one of the pipes, and detect it, so as not to add a point for both the upper and lower pipe. Update the `onUpdate` handler as below:  


```js
onUpdate("pipe", (pipe) => {
	pipe.move(-160, 0);

	if (pipe.passed === false && pipe.pos.x < player.pos.x) {
	  pipe.passed = true;
	  score += 1;
	  scoreText.text = score;
	}
});
```

This checks any pipe that we haven't marked as `passed` (`passed === false`) to see if it has passed Flappy (`pipe.pos.x < player.pos.x`). If the pipe has gone passed, we add `1` to the score, and also update the score text on screen. 

Press `command + s` (mac) or `control + s` (Windows/Linux) to update the game output window. You should see the score increase as you fly past each pipe


## Collision detection

Now that we have scoring, the last thing to do is collision detection - that is, checking if Flappy has splatted into a pipe. Kaboom has a [`collides`](https://kaboomjs.com/#onCollide) method that is added with the [`area`](https://kaboomjs.com/#area) collider component. We can use that to call a function when the player collides with any character with the `"pipe"` tag. Add this code to the `game` scene:


```js
player.collides("pipe", () => {
	go("gameover", score);
});
```
In the collision handler, we use the [`go`](https://kaboomjs.com/#go) function to switch to the `gameover` scene. We don't have anything in that scene yet, so let's update that to show a game over message and the score. We can also keep track of the high score to compare the player's latest score to. Update the `gameover` scene as follows:


```js
let highScore = 0; 
scene("gameover", (score) => {
  if (score > highScore) {
    highScore = score;
  }

  add([
    text(
      "gameover!\n"
      + "score: " + score
      + "\nhigh score: " + highScore,
      {size: 45}
    )
  ]);

  onKeyPress("space", () => {
    go("game");
  });
});

```

First, we create a `highScore` variable where we can track the top score across multiple games. Then, in our `gameover` scene, we check if the latest score passed in is bigger than the `highScore` we have recorded. If it is, the `highScore` is update to the latest score. 

To show a "game over" message, and the player's score along with the high score, we use the [`add`](https://kaboomjs.com/#add) function to add a [`text`](https://kaboomjs.com/#text) component to a new game object / character. We also make the font `size` large-ish for this message. 

Normally the player would want a quick way to play again to try beat their score. We use the [`onKeyPress`](https://kaboomjs.com/#onKeyPress) to listen for the player pressing the `space` bar. In our key press handler, we [`go`](https://kaboomjs.com/#go) back to the main `game` scene, which will start the game all over again. 

We also need to end the game if Flappy flies too high out of the screen, or plummets down off the screen. We can do this by adding a handler for the player's [`onUpdate`](https://kaboomjs.com/#add) event, which is called each frame. Here we can check if Flappy's position is beyond the bounds of the game window. Add this code to the `game` scene: 

```js
player.onUpdate(() => {
	if (player.pos.y > height() + 30 || player.pos.y < -30) {
	  go("gameover", score);
	}
});
```

This gives a margin of 30 pixels above or below the window, to take account of Flappy's size. If Flappy is out of these bounds, we [`go`](https://kaboomjs.com/#go) to the `gameover` scene to end the game. 

Press `command + s` (mac) or `control + s` (Windows/Linux) to update the game output window. If you fly into a pipe now, or flap too high, or fall out of the sky, you should be taken to the game over screen: 

![game over screen](game-over.gif)


## Next steps

Congratulations! You've just made your own clone of Flappy Bird. What things can you do to add to the game? Here are some ideas:

- Make the game play faster as the player gets a higher score.  You can do this by updating the speed that the pipes move by making the speed parameter passed to the `pipe.move` method a variable, which increases as the player score increases.
- Add some different types of obstacles, other than the pipes, for Flappy to try avoid. 
- Use the [Kaboom sprite editor](https://docs.replit.com/tutorials/kaboom-editor) to create your own graphics for your Flappy world!
- Add in some more sound effects and play some game music using the [`play`](https://kaboomjs.com/#play) function.

Happy Coding!



