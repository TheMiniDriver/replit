# Build a Space Shooter with Kaboom.js

In this tutorial, we'll build a space shooter game, with a platformer feel. We'll use [kaboom.js](https://kaboomjs.com) for the game engine, and we'll code it using [Replit](https://replit.com) as our IDE (Integrated Development Environment). 

This is what the game will look like when we're done:

![What the finished game should look like](finished-game.gif)


## Game Design

These are the main things we want in this game:

- Fast action - the player needs to move around a lot
- Good sound effects. This helps immerse players into the game and contributes to the overall game vibe. 
- Lots of shooting opportunities
- It should get harder and faster the better the player gets

To achieve this, we'll have a spaceship that the player can fly around collecting gems on a faraway planet. The player will need to dodge or shoot alien bugs that explode on contact. The spaceship will lose shield strength each time an alien bug hits the craft. The game will get faster with more alien bugs for every 1000 points the player earns. 

## Creating a New Project in Replit

Let's head over to [Replit](https://replit.com) and create a new repl. Choose **Kaboom** as your project type. Now, give this repl a name, like "Space Shooter".

After the repl has booted up, you should see a `main.js` file under the "Scenes" section. This is where we'll start coding.

## Getting Started with Kaboom.js

[Kaboom.js](https://kaboomjs.com) is a Javascript library that contains a lot of useful features to make simple browser games. It has functionality to draw shapes and sprites (the images of characters and game elements) to the screen, get user input, play sounds and more. We'll use some of these feaatures in our game to explore how it works. 

The Kaboom Replit interface is specialised for game-making as well. Besides the Space Invader icon, you'll notice a few special folders in the file try, like "Scenes", '"Sprites", and "Sounds". These special folders take care of loading up assets, and all the neccessary code to start scenes and direct the game. You can read up more about this interface [here](https://docs.replit.com/tutorials/kaboom). 

Kaboom.js also makes good use of Javascript's support for [callbacks](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) - instead of writing loops to read in keyboard input and check if game objects have collided (bumped into each other), Kaboom.js uses an event model, where it tells us when these things have happened. Then we can connect up [callback functions](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) that act on these events. 

Kaboom also works on the idea of "Scenes". Scenes are like levels, or different parts and stages of a game. The IDE has a default "main" scene already, which we can use for our main game code. Inside Scenes, we can have multiple "Layers". This allows us to have backgrounds that don't affect the game, main game objects (like the player, bullets, enemies etc), and also UI elements (like the current score, health etc). 

Add the following code to the `main.js` file to create the 3 layers "Background (`bg`)", "Object (`obj`)", "User Interface (`ui`): 

```javascript
layers([
    "bg", 
    "obj", 
    "ui", 
], "obj"); 
```

The `obj` layer is set as the default layer. Now we can add a static background of stars to our scene, by adding the code:

```javascript
add([
    sprite("stars"), 
    layer("bg")
]);
```
The sprite `stars` refers to an image in the Sprites folder - You can download this [zip file](assets.zip) which contains all the sprites and sounds for the game. Add the sprites to the "Sprites" section in the Replit editor, and the sounds to the "Sounds" section. 

## Creating the Game Map

Let's get a scene layout, or _map_ drawn on the screen. This will define the ground and platforms in the game.

Kaboom.js has built in support for defining game maps, using text and the function [`addLevel`](https://kaboomjs.com/#addLevel). This takes away a lot of the hassle normally involved in loading and rendering maps. 


Add this code to the `main.js` file to create the game map:

```javascript

// Game Parameters
const MAP_WIDTH = 440; 
const MAP_HEIGHT = 275;
const BLOCK_SIZE = 11;  

const map = addLevel([
    "--------------------------------------------",
	"-                                          -",
    "-                                          -",
	"-                                          -",
	"-                                          -",
	"-                                          -",
	"-                                          -",
	"-                                          -",
	"-                                          -",
	"-                                          -",
	"-                                pppppp    -",
	"-                                          -",
	"-                                          -",
	"-                                          -",
	"-                                          -",
	"-                                          -",
	"-   pppppp                                 -",
	"-                                          -",
	"-                                          -",
	"-                 pppppp                   -",
	"-                                          -",
	"-                                          -",
	"-                                          -",
	"-                                          -",
	"============================================",
    "                                            "
], {
	width: BLOCK_SIZE,
	height: BLOCK_SIZE,
	pos: vec2(0, 0),
	"=": [
        rect(BLOCK_SIZE, BLOCK_SIZE), 
		color(1,0,0),
        "ground", 
        solid()
	], 
	"p": [
        rect(BLOCK_SIZE, BLOCK_SIZE), 
		color(0,0,1),
        "platform", 
        solid()
	],
    "-": [
        rect(BLOCK_SIZE/10, BLOCK_SIZE), 
		color(0,0,0),
        "boundary", 
        solid()
    ], 
});

```
In the first section, we add some game parameters, which we'll use when defining the size of the map, and the default block size for map elements. 

Now we create the game map. The map, or level design, is expressed in an array of strings. Each row in the array represents one row on the screen. So, we can design visually in text what the map should look like. The width and height parameters specify the size of each of the elements in the map. The pos parameter specifies where on the screen the map should be place – we choose (0,0), which is the top left of the screen, as the starting point for the map.

Kaboom.js allows us to specify what to draw for each symbol in the text map. You can make maps out of many different elements – e.g., a symbol for a wall, a symbol for for ground, a symbol for a jump and so on. To tell Kaboom.js what to draw for the symbol, we add the symbol as a key, for example `=`, and then specify parameters for it. 

In this code, we have 3 different type of fixed map elements: `=` representing the ground, `p` representing platforms, and `-` representing the invisible boundaries of the screen. Each of the  map elements has a tag (`platform`, `boundary`, `ground`, which is the string name grouping the individual pieces together, so we can easily refer to them collectively later.  


## Adding the Spaceship

Let's add the spaceship using the [`add`](https://kaboomjs.com/#add) function of Kaboom

```javascript
const player = add([
    sprite("spaceship"), 
    pos(100, 200), 
    body(), 
    scale(1),
    rotate(0), 
    origin("center"),
    "player", 
    {
        score : 0, 
        shield : 100
    }
]); 


player.action(() => {
    player.resolve();
});

```

The [`add`](https://kaboomjs.com/#add) function constructs a game object using different components, eg `pos`, `body`, `scale` etc. Each of these components gives the object different features. 

Notably, the [`body`](https://kaboomjs.com/#body)component makes the object react to gravity - which makes the spaceship fall if it's not on the ground or a platform. The ['rotate'](https://kaboomjs.com/#rotate) component allows us to tilt the spaceship in the direction the player wants to go, which provides good visual feedback. By default, all operations are calculated around the top left corner of game objects. To make the tilt work correctly, we add the [`origin`](https://kaboomjs.com/#origin) component, set to `center`,so the tilt adjust the angle from the center of the object rather. 

Kaboom also allows attaching custom data to a game object. We've added `score` to hold the player's latest score, and `shield`, holding the percentage of protection shield on the ship still available. We can adjust these as the player picks up items, or crashes into aliens. 


You'll notice that when we created the `map` earlier, we added the [`solid`](https://kaboomjs.com/#solid) component to the map objects. This component marks the object so other objects can't move past them. If we add `solid` to an object, we also need to add code to resolve the position of movable objects that might need to be obstructed by these solid object. This is why we add the `player.resolve()` call, in the [`action`](https://kaboomjs.com/#action) event of the player, or spaceship. 


## Moving the Spaceship

We'll allow a few different moves for the spaceship - change direction left or right and fly up. Kaboom provides the [`keyDown`](https://kaboomjs.com/#keyDown) event, which lets us know if a certain key is being pressed. We also need to keep track of which way the spaceship is facing, so that we'll know which side to shoot lasers from later. 

To handle the changing and tracking direction, add the following code:

```javascript
const directions = {
  LEFT: "left", 
  RIGHT: "right"
}

let current_direction = directions.RIGHT; 

keyDown("left", () => {
    player.flipX(-1);
    player.angle = -0.2; 
    current_direction = directions.LEFT; 
    player.move(-100,0);
});

keyDown("right", () => {
    player.flipX(1);
    player.angle = -0.2; 
    current_direction = directions.RIGHT; 
    player.move(100,0);  
});


keyRelease("left", ()=>{
    player.angle = 0; 
}); 

keyRelease("right", ()=>{
    player.angle = 0; 
}); 

```

First, we create a constant object defining the directions our game allows. Then we create a variable to track the `current_direction` the spaceship is facing. 

Then we add the key handling code. The key names `left` and `right` refer to the left and right arrow keys on the keyboard. We create `keyDown` event handlers for each of these. `keyDown` calls the event handler repeatedly for as long as the given key is held down. 

The code inside these `keyDown` does the following: 
- Using the `flipX` function, we mirror the player's spaceship image, so that it looks different depending on the direction it is facing. `-1` flips it to seem like it's facing the left, `1` for right. 
- `player.angle` slightly tilts the spaceship while the key is being held down. This is so the spaceship looks like it is about to move in the given direction. 
- We also update the `current_direction` tracking variable. We'll use this variable when we add shooting. 
- We use the `move` function to actually move the spaceship in the given direction. 

We also have `keyRelease` event handlers for the left and right keys. These are so we can reset the spaceship's tilt angle to 0 (i.e. straight up) when the ship is no longer moving in that direction. 

Lastly, we need to be able to fly up when we press the space key. To do this, we'll take advantage of Kaboom's [`jump`](https://kaboomjs.com/#body) attribute which is part of the [`body`](https://kaboomjs.com/#body) component, and repurpose it for flying up. 

```javascript
keyDown("up", () => {
      player.jump(100); 
});
```

## Adding Laser Guns

Because the game takes place in outer space, the natural weapon of choice is a laser gun. We'll need to add functions to create the bullet when the player fires, and to control the direction of the bullets. We'll also need to add another key handler to check when the player presses "fire", which is the space key in this game. 

```javascript

const BULLET_SPEED = 400;

keyPress("space", () => {
	spawnBullet(player.pos);
});

function spawnBullet(bulletpos) {
    if (current_direction == directions.LEFT){
        bulletpos = bulletpos.sub(10,0); 
    } else if (current_direction == directions.RIGHT){
        bulletpos = bulletpos.add(10,0); 
    }
	add([
		rect(6, 2),
		pos(bulletpos),
		origin("center"),
		color(1, 1, 1),
		"bullet",
        {
            bulletSpeed : current_direction == directions.LEFT?-1*BULLET_SPEED: BULLET_SPEED 
        }
	]);

    play("shoot", {
		volume: 0.2,
		detune: rand(-1200, 1200),
	});
}
```

Firstly we add a constant `BULLET_SPEED` to define the speed at which the laser "bullets" fly across the screen. Then we use the [`keyPress`](https://kaboomjs.com/#keyPress) event to trigger the shooting. Notice `keyPress` only calls the event handler once as the key is pressed, as opposed to the `keyDown` event we used for moving. This is because it's more fun if the player needs to bash the "fire" button as fast as possible to take down an enemy, rather than just having automatic weapons. 

The `keyPress` handler calls the `spawnBullet` function with the player's current position. This function handles creating a new laser shot in the correct direction. The first few lines of the method adjust the bullet's starting position a little to the left or right of the spaceship's position. This is because the position of the spaceship that gets passed to the function is the center of the spaceship (remember the `origin` component we added to it?). We adjust it a little bit so that the bullet looks like it is coming from the edge of the spaceship.

Then we add a new bullet object to the game, using the [`add`](https://kaboomjs.com/#add) function. For the bullet, we don't use a sprite, but instead just draw a [`rect`](https://kaboomjs.com/#rect), or rectangle, with our given color. We tag it with `bullet`, so we can refer to it later when detecting if it hit something. We also give it a custom property `bulletSpeed`, which is the amount and direction we want the bullet to move each frame. 

Then finally, we need some sound effects when the player shoots, so we use the [`play`](https://kaboomjs.com/#play) function to play our "shoot.wav" file. We adjust the volume down a bit so it fits in better with the overall sound mix. Then we also use the `detune` parameter, along with a random number generator, [`rand`]('https://kaboomjs.com/#rand'), to change the pitch of the sound each time it is played. This is just so the same sound doesn't become too repetitive, but mainly because it sounds weird and "spacey". 

Now that we've set up the bullet, we need to make it move on each frame. To do this we can use the [`action`](https://kaboomjs.com/#action) event, using the `bullet` tag to identify the objects we want to update. 

```javascript
action("bullet", (b) => {
	b.move(b.bulletSpeed,0);
	if ((b.pos.x < 0) ||(b.pos.x > MAP_WIDTH)) {
		destroy(b); 
	}
});
```
For each frame action event, Kaboom fires our handler for each object matching the tag, in the this case `bullet`, that we provide. We then call [`move`](https://kaboomjs.com/#pos) on the bullet, using the custom value for `bulletSpeed` that we assigned the bullet when creating it. We also have a check to see if the bullet goes off the screen, and we [`destroy`](https://kaboomjs.com/#destroy) it. 

We also need to destroy the bullet if it hits a platform. Using the Kaboom [`collides`](https://kaboomjs.com/#collides) event, we can handle that case: 

```javascript
collides("bullet","platform", (bullet, platform) =>{
    destroy(bullet); 
}); 
```

## Adding Alien Space Bugs

Now that we have a spacecraft and it can shoot, we need something to shoot at. Let's add some exploding hostile alien space bugs. We'll want to keep them coming in a relatively constant stream, so the game is challenging. We also want them coming in from different sides and angles to keep the player on their toes. We'll add a new function to control the creation of alien space bugs. 

```javascript

const ALIEN__BASE_SPEED = 100; 
const ALIEN_SPEED_INC = 20; 

function spawnAlien() {
    let alienDirection = choose([directions.LEFT, directions.RIGHT]); 
    let xpos = (alienDirection == directions.LEFT ? 0:MAP_WIDTH); 

    const points_speed_up = Math.floor(player.score / 1000); 
    const alien_speed = ALIEN__BASE_SPEED + (points_speed_up * ALIEN_SPEED_INC); 
    const new_alien_interval = 0.8 - (points_speed_up/20); 

	add([
		sprite("alien"),
		pos(xpos, rand(0, MAP_HEIGHT-20)),
		"alien",
		 {
		 	speedX: rand(alien_speed * 0.5, alien_speed * 1.5) * (alienDirection == directions.LEFT ? 1: -1),
            speedY: rand(alien_speed * 0.1, alien_speed * 0.5) * choose([-1,1])
		 },
	]);

	wait(new_alien_interval, spawnAlien);
}

spawnAlien(); 
```

We created 2 parameters for the alien's speed - a base rate, and an incremental rate which we will add each time the player gains another 1000 points. Tip: you can put these parameters, and all the others we have defined at the top of the file, so that they are easy to adjust if you want to tweak the game parameters later. 

Then we the define the `spawnAlien` function. To randomly choose the side of the screen the alien will fly in from, we use the Kaboom [`choose`](https://kaboomjs.com/#choose) function, which picks an element at random from an array. From the chosen direction, we can determine the aliens starting position on the `x axis` (horizontal plane).

Then we go into the calculation to figure out the speed that the alien should move at. First, we see if need to speed up the alien based on the player's score. We want to speed the aliens up for every 1000 points the player manages to get, so we divide the player's score, and get rid of decimals by using the [`Math.floor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor) function which is built into Javascript. 

Now that we know the ratio we need to speed up the aliens, we can take the `ALIEN_BASE_SPEED` and add the incremental speed up rate multiplied by the points ratio. 

We also calculated a new rate at which aliens are spawned - making the aliens not only faster at moving, but also faster at respawning. 

Now that we've calculated our basic parameters, we create a new alien, using the [`add`](https://kaboomjs.com/#add) function again:
- `sprite('alien')` creates the alien with the image `alien`. 
- `pos(xpos, rand(0, MAP_HEIGHT-20))` sets the starting position of the alien. We calculated the `x pos` from the randomly chosen direction. We also add a random `y` (vertical) position for the alien, between the top (position `0`) of the map, and the bottom (`MAP_HEIGHT`) of the map (screen co-ordinates start from the top left of the screen). We remove `20` pixels from the bottom bounds, to account for the ground. 
- We add the `"alien"` tag to the object so we can identify and call it in other parts of the code. 
- We also add a custom object with the speed of this particular alien, broken into it's speed along the `x` and `y` axes. For the speed along the x dimension `speedX`, we add a random component so that not all aliens move at exactly the same speed. Then we also multiply the speed by -1 or 1 depending if the alien is meant to be moving left or right across the screen. 

Finally, we use Kaboom's [`wait`](https://kaboomjs.com/#wait) function to wait a short amount of time and then call `spawnAlien` again to create a new alien. We also have a call to `spawnAlien` to get it started when the game starts. 


## Moving the Aliens

To move the aliens, we'll create an handler to attach to the `action` event, which fires for each alien object, every frame, like we did for the bullets: 

```javascript
action("alien", (alien) => {
	alien.move(alien.speedX, alien.speedY);
	
	if ((alien.pos.y - alien.height > MAP_HEIGHT) || (alien.pos.y < 0)) {
		destroy(alien);
	}
    if ((alien.pos.x < -1 * alien.width) ||(alien.pos.x > MAP_WIDTH)) {
		destroy(alien);
	}
});
```

Firstly, the function moves the alien by the amount we calculated early and saved to the alien's custom data. 

Then the function checks. to see if the alien has moved out of bounds of the map area - if it has, we destroy it, as it is no longer visible. Having too many active objects can decrease performance, so this step is important. 

## Shooting the Aliens

Now that we have moving aliens, a moving spaceship, and laser bullets, let's add the code to deal with a laser bullet hitting an alien. Of course, we want this to have a cool explosion and sound effect to give good feedback to the player. 


```javascript
collides("alien","bullet", (alien, bullet) =>{
    makeExplosion(alien.pos, 5, 5, 5);
    destroy(alien); 
    destroy(bullet); 
    play("explosion", {
		volume: 0.2,
		detune: rand(0, 1200),
	}); 
}); 

```

This is similar to the code used before to check if a bullet hit a platform. We [`destroy`](https://kaboomjs.com/#destroy) both the bullet and alien to remove them from the scene. Then we use the [`play`](https://kaboomjs.com/#playhttps://kaboomjs.com/#play) function to play the explosion sound effect. We set the volume so it fits in the mix, and we also put a random detune (pitch adjust) on the sound, to vary it and make it more interesting when a lot of aliens are being shot at. 

We also call out to a function to create an explosion around the area where the alien bug used to be. This code is from the ["shooter" example on the Kaboom examples page]('https://kaboomjs.com/examples#shooter') (which is a great game). It makes a series of bright white flashes around the explosion site. It gives a cool cartoon or comic book like feel to the explosions. Add this code in:

```javascript
function makeExplosion(p, n, rad, size) {
		for (let i = 0; i < n; i++) {
			wait(rand(n * 0.1), () => {
				for (let i = 0; i < 2; i++) {
					add([
						pos(p.add(rand(vec2(-rad), vec2(rad)))),
						rect(1, 1),
						color(1,1,1),
						origin("center"),
						scale(1 * size, 1 * size),
						grow(rand(48, 72) * size),
						lifespan(0.1),
					]);
				}
			});
		}
}

function lifespan(time) {
		let timer = 0;
		return {
			update() {
				timer += dt();
				if (timer >= time) {
					destroy(this);
				}
			},
		}
}

function grow(rate) {
    return {
        update() {
            const n = rate * dt();
            this.scale.x += n;
            this.scale.y += n;
        },
    };
}
```

The `makeExplosion` function has four _arguments_ (inputs to the function). These are:
- `p`, the center position to base the explosions around
- `n`, the number of main flashes to make
- `rad`, the radius or distance from `p` to make the flashes in
- `size`, the size of each of the flashes

The function create a [`for loop`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for)to loop for `n` time (the number of main flashes we want to make). It uses the Kaboom [`wait`](https://kaboomjs.com/#wait) function to leave a little bit of time (0.1) seconds betweeen each main flash. 

Another `for` loop loops twice to create 2 sub flashes, using the Kaboom [`add`](https://kaboomjs.com/#add) function to add a [`rectangle`](https://kaboomjs.com/#rect) shape for each flash, and setting the color to bright white (Color components in Kaboom go from 0-1). This rectangle starts out at 1 pixel in each dimension. Then the [`scale`](https://kaboomjs.com/#scale) component is added to increase the size of the flash to the `size` passed in to the function - and will be used later when we "grow" the explosion. The [`origin`](https://kaboomjs.com/#origin) component is used to set the origin of the rectangle to it's center - this will be used when we "grow" the flash to give the impression that it is starting from a small point and exploding. Setting the origin as the center, and therefore as the position around which scaling etc is calculated will give it a more natural feel. 

To make the flashes appear around the position `p` that we specified, the [`pos`](https://kaboomjs.com/#pos) component is adjusted by a random amount, ranging from `-rad` to `rad`, the radius we specified (in other words, the blast area). 

Then there are references to two custom components - `lifespan` and `grow`. Kaboom allows us to define our own components to give objects any behaviour or attributes we want. All we need to do is create a function that returns an object with a method called `update`, which is then called for each frame for the object the component is added to. 


The first custom component is `grow`. This is used to create the effect that the flash is expanding out, much like a firework explosion starts at a small point and gets larger until it disappears. In `grow`'s `update` function, the object is scaled up (available because we used the [`scale`](https://kaboomjs.com/#scale) component on the object) each frame. This is calculated from the `rate` passed in - which is the size the object should grow per second, multiplied by the time difference from the last frame, using the Kaboom [`dt`](https://kaboomjs.com/#dt) function, which provides that time difference in seconds for us. The explosion flash will keep on growing each frame - therefore we need a way to end the explosion before it covers the entire screen. 

`lifespan` is implemented to automatically [`destroy`](https://kaboomjs.com/#destroy) the object after a short amount of time, to solve the ever growing explosion problem. This works by having a `timer` variable, which is updated each frame with the difference in time from the last frame, using the Kaboom [`dt`](https://kaboomjs.com/#dt) function again. When the `timer` count is more than the `time` parameter passed into the component, the object is automatically [`destroyed`](https://kaboomjs.com/#destroy). This creates the impression of a quick explosion blast. 

## Exploding the Alien Bugs on Contact

When the alien bugs hit something solid, they should explode. This is their danger. To start, we'll add code to explode the bugs when they hit a platform or the ground. 

```javascript
collides("alien","platform", (alien, platform) =>{
    makeExplosion(alien.pos, 5, 3, 3);
    destroy(alien); 
    play("explosion", {
		volume: 0.1,
		detune: rand(-1200, 1200),
	});
}); 

collides("alien","ground", (alien, ground) =>{
    makeExplosion(alien.pos, 5, 3, 3);
    destroy(alien); 
    play("explosion", {
		volume: 0.1,
		detune: rand(-1200, 1200),
	});
}); 
```

We have 2 collision handlers - one for aliens hitting a platform, and one for aliens hitting the ground. They both do the same thing. First, since we have a great explosion creating function, we use it gratuitously. Then we [`destroy`](https://kaboomjs.com/#destroy) the alien object to remove it from the scene. Finally we play an explosion, at a lower volume as this explosion is not caused by or directly affects the player. We also add the usual random [`detune`](https://kaboomjs.com/#play) to modify the sound each time and keep it interesting. 


## Adding in Score and Shield UI

Before we go further, and allow the alien bugs to damage the spaceship, and add in the gems to collect, we'll add in the UI to show the ship's shield health and overall score. Then we can update these as we need in the game. 

First, add text for the player's score: 

```javascript
add([
	text("SCORE: ",8),
	pos(100, 10),
	origin("center"),
	layer("ui"),
]);

const scoreText = add ([
	text("000000",8),
	pos(150, 10),
	origin("center"),
	layer("ui"),
]);
```

Here we add in two new objects, rendered with the [`text`](https://kaboomjs.com/#text) component. The first is just the static label for the score. The second is the text placeholder for the actual score. Note that the [`layer`](https://kaboomjs.com/#layer) component is used on both to place the text on the UI layer we created at the start of the tutorial. We haven't had to specify the layer for all our other game object, because we set the `obj` layer as the default to use when we defined the layers. 

Now that we have the UI components for showing the score, we need a function to update the score when it changes, and reflect it on the UI. 

```javascript
function updateScore(points){
    player.score += points; 
    scoreText.text = player.score.toString().padStart(6,0); 
    play("score", {
		volume: 0.5,
		detune: rand(-1200, 1200),
	});
}
```
This `updateScore` function takes as it's argument the number of points to add to the score. Then it adds them to the player's current score - remember we added `score` as a custom property when we created the player (spaceship) object. 
Then we update the `ScoreText` UI element we created above. The player's score is converted to a string using Javascript's [`toString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) method, which is part of every object in Javascript. It is also modified with [`padStart`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) which makes sure the resulting score string is exactly `6` digits long, using `0`'s to put in front (`start`) of the string if the number is smaller than 6 digits long. This makes nice placeholder for the score, and gives a cue to the users as to the upper score they could achieve. Finally we play a little sound to indicate that points have been earned. As usual, we vary the pitch each time using [`detune`](https://kaboomjs.com/#play) to keep the sound fresh. 

Now we can update the points when we need. 

The next UI element is the ship shield. This would be great as a kind of health bar style display, that starts out green and goes red when the shield is low. The game should end when the shield is fully depleted, as the spaceship is then totally destroyed. 

```javascript
add([
	text("SHIELD: ",8),
	pos(300, 10),
	origin("center"),
	layer("ui"),
]);

const shieldHolder = add ([
    rect(52,12),
	pos(350, 10),
    color(100,100,100),
	origin("center"),
	layer("ui"),
]);

const shieldHolderInside = add ([
    rect(50,10),
	pos(350, 10),
    color(0,0,0),
	origin("center"),
	layer("ui"),
]);

const shieldBar = add ([
    rect(50,10),
	pos(325, 5),
    color(0,255,0),
	layer("ui"),
]);
```

First, we add a text label so that player's known what the bar represents. To create the shield bar UI, we use 3 elements : A border, or `shieldHolder` to outline the bar, a black inner block to make the holder look a thin line, `shieldHolderInside`, and finally the `shieldBar` itself which will get shorter as the shield is damaged. 


Now we need a function to call when we want to update the shield's health. 

```javascript
function updatePlayerShield(shieldPoints){
    player.shield += shieldPoints; 
    player.shield = Math.max(player.shield, 0); 
    player.shield = Math.min(player.shield, 100); 

    shieldBar.width = 50 * (player.shield / 100);

    if (player.shield < 20) shieldBar.color = rgb(1,0,0); 
    else if (player.shield < 50) shieldBar.color = rgb(1,0.5,0); 
    else shieldBar.color = rgb(0,1,0); 

    if (player.shield <=0){ 
        destroy(player); 
        for (let i = 0; i < 500; i++) {
            wait(0.01 *i, ()=>{
                makeExplosion(vec2(rand(0,MAP_WIDTH,), rand(0, MAP_HEIGHT)), 5, 10, 10); 
                play("explosion", {
                    detune: rand(-1200, 1200)            
                });  
            });   
        }
        wait(2, ()=>{
            go("endGame"); 
        }); 
	}
}  
```

This function has an argument for the number of `shieldPoints` to update the shield by. It adjusts the custom `shield` property on the player by the number of points. It also clamps the minimum and maximum amount the shield can be to between 0 and 100. 

The function sets the width (which is the dimension along the x axis) of the `shieldBar` to the percentage (`player.shield / 100`) of the shield available, then multiplied by the full width, `50`, of the bar.

Then the function updates the color of the bar depending on the health of the shield :
- Less than 20% shield is full red;
- Less than 50%, but more than 20% is orange;
- Otherwise the shield is more than 50%, so it is set to green.

The final check in the shield is the logic to see if the shield is completely depleted, which is when it's value reaches 0. If it is, we need to end the game as the spaceship has been destroyed. First, we destroy the spaceship to remove it from the scene. Now we have another perfect opportunity to create some more explosions using the `makeExplosion` function we added earlier. This time we can go really big! To make a big impact, we create a `for` loop to set off 500 explosions all over the screen for serious dramatic effect. We use the Kaboom [`wait`](https://kaboomjs.com/#wait) function to have a small delay between each explosion, so that they don't all go off at once. Then we make each explosion happen at random positions on the map, passing in other parameters to the `makeExplosion` function to set the blast radius, number of sub-explosions and general size. We also play the `explosion` sound effect using Kaboom's [`play`](https://kaboomjs.com/#play) function. This time we don't adjust the volume down as we want the sound as overwhelming and dramatic as possible. We do detune it randomly again to create a true cacophony and sense of mayhem. 

After setting off all those sound effects and visual fireworks, we [`wait`](https://kaboomjs.com/#wait) for 2 seconds for everything to settle down, and then use the Kaboom function [`go`](https://kaboomjs.com/#go) to switch to a new scene, `endGame`, to wait for the player to play again. To add this new scene, click the "+" button next to the "Scenes" collection in the left menu, and then type in `endGame`. Then add this code to the new scene: 

```javascript
const MAP_WIDTH = 440; 
const MAP_HEIGHT = 275;

add([
	text("GAME OVER ",40),
	pos(MAP_WIDTH / 2, MAP_HEIGHT / 3),
	origin("center"),
	layer("ui"),
]);


keyRelease("enter", ()=>{
    go("main");
});
```

This scene [`adds`](https://kaboomjs.com/#add) a large "GAME OVER" text over the screen. Then it waits until the `enter` key is pressed and released, using the [`keyRelease`](https://kaboomjs.com/#keyRelease) event. This then returns back to the main scene, using [`go`](https://kaboomjs.com/#go) to switch scenes, starting the game again. Because this is a new scene, in a new scope, we need to add the `MAP_WIDTH` and `MAP_HEIGHT` constants again. 

## Allowing the Alien Bugs to Attack

Now that we have point scoring and shield health update mechanisms, we can add the code for alien bugs hitting the spaceship. 


```javascript
const ALIEN_SHIELD_DAMAGE = -15; 

overlaps("alien", "player", (alien, player) =>{
    camShake(20); 
    makeExplosion(alien.pos, 8, 8, 8);
    destroy(alien); 
    play("explosion", 
    {
      detune: -1200, 
      volume : 0.5
    }); 
    updatePlayerShield(ALIEN_SHIELD_DAMAGE); 
}); 
```

This time, instead of the [`collides`](https://kaboomjs.com/#collides) collision detector, we use [`overlaps`](https://kaboomjs.com/#overlaps). The big difference between the two is that `collides` will call our given function even if just the edges of the game objects touch, where `overlaps` means that the game objects must be more than touching, i.e. there must be at least 1 pixel overlap, before firing the callback function. Using `overlap` here allows near misses, and also a better visual effect when the alien bug crashes right into the spaceship. 

As this is a big event - it's the way the ship shield gets damaged and can be fatal, we need to add a bit more dramatic effect. Kaboom can create a cool effect of shaking up the whole screen, to make it "feel" like something has hit the player. By calling [`camShake`](https://kaboomjs.com/#camShake) with a number representing how dramatic the shake should be, we can invoke this effect. Then we add some visual effect with the `makeExplosion` function. We also destroy the alien, as it has exploded. We also [`play`](https://kaboomjs.com/#play) the `explosion` effect again, but a bit louder this time as the alien exploding has directly affected the player. We also detune the effect to the lowest pitch we can, as this gives it more bass, and will make it "feel" more direct, particularly if the player has a sub-woofer. 

Then we call the `updatePlayerShield` function we defined previously, with constant that defines how much shield is damaged per hit. You can move the constant to the top of the main scene file to keep it neat if you want. 

## Raining Gems

Now that we have the attack and defense actions, we can add the purpose of the game - collecting gems, which gives points. Add this function to create a gem. 


```javascript
function spawnGem(){
    let xpos = rand(BLOCK_SIZE, MAP_WIDTH - BLOCK_SIZE);  
    add([ 
		sprite("gem"),
		pos(xpos, BLOCK_SIZE),
        body(), 
		"gem"
	]);
}

action("gem", (gem)=>{
    gem.resolve();

    if (gem.pos.y > MAP_HEIGHT) {
        destroy(gem); 
        spawnGem(); 
    }

});

spawnGem(); 
```

On this weird planet in outer space, the gems rain from the sky, which is the top of the map for our purposes. We calculate a random position, `xpos`, along the `x` axis for the gem to appear on, by calling the Kaboom [`rand`](https://kaboomjs.com/#rand) function. We don't want the gems to fall right at the edge of the screen, as they will be cut off and the spaceship won't be able to get to them - remember we added `boundary` map elements all around the screen which the spaceship is blocked by. Therefore, we limit the random `xpos` to one `BLOCK_SIZE` from each edge. 

Now we have the random position in the sky that the gem will fall from, we [`add`](https://kaboomjs.com/#add) the gem sprite to the scene. The `pos` component is set to the `xpos` we calculated, with the y component set to one `BLOCK_SIZE` from the top of the screen. This is to avoid the gem getting stuck on our upper `boundary`. We also give the gem the [`body`](https://kaboomjs.com/#body) component, which makes it subject to Kaboom gravity so that it falls down towards the ground. It also has the label `gem` so that we can refer to it later. 

Then we need to add the [`action`](https://kaboomjs.com/#action) event handler for the gem - we need to do this for all objects with a `body` component so that interactions with [`solid`](https://kaboomjs.com/#solid) objects are taken care of. We do this by calling the `resolve` method on the gem. Unfortunately, sometimes if the frame rate gets too low (eg a lot of action, or a slow computer), the `resolve` function may miss an `body` and `solid` interaction, with the result that the [`object falls through the solid`](https://github.com/replit/kaboom/issues/86).  This could cause the gems to fall through the ground, out of reach of the player's spaceship. To mitigate against this, we check if the gem's `y` position is beyond the maps bounds. If so, we destroy that gem and create a new one. 

Finally, we kick of a call to `spawnGem()` to start the gem raining process. 

## Collecting Gems

Now that gems are raining down, we can add a handler to see when the player's spaceship moves over a gem. This is considered picking it up, and will give the player points. Add the following [`overlaps`](https://kaboomjs.com/#overlaps) event handler:

```javascript
const POINTS_PER_GEM = 100; 

overlaps("player","gem", (player, gem) =>{
    destroy(gem);
    updateScore(POINTS_PER_GEM); 
    wait(1, spawnGem); 
});
```
This fires whenever the player is on a gem. If so, we [`destroy`](https://kaboomjs.com/#destroy) the gem to remove it from the scene. Then we call the `updateScore` function we added earlier, updating the points by the amount in the `POINTS_PER_GEM` constant. Then we [`wait`](https://kaboomjs.com/#wait) one second before creating, or spawning, another gem for the player to collect.

## Adding background music

Having sound effects is cool, but games generally need a soundtrack to tie all the sounds together. Kaboom allows us to play a sound file on loop to have constant background music. Add this code to play the track: 


```javascript
const music = play("music");
music.loop();
```
The music is a track called "Battle of Pogs" by "Komiku" from ["Free music archive"](https://freemusicarchive.org/music/Komiku/Captain_Glouglous_Incredible_Week_Soundtrack/pog), a good resource for music that you can legally use in your games. 

## Playing the game

Congratulations, you've finished making this Kaboom game! Try running and playing the game to see what score you can get. You can also try adjusting all the parameters to see how they all change the game play. 

## Credits

The game art and sounds used in this tutorial are from the following sources. Thank you to all the creators for putting their assets up and allowing their use with a Creative Commons license! 

- Music : https://freemusicarchive.org/music/Komiku/Captain_Glouglous_Incredible_Week_Soundtrack/pog
- Laser : https://freesound.org/people/sunnyflower/sounds/361471/
- Explosion: https://freesound.org/people/tommccann/sounds/235968/
- Point Beep : https://freesound.org/people/LittleRobotSoundFactory/sounds/270303/

- Gem: https://opengameart.org/content/planetcute-gem-bluepng
- Space Background: https://opengameart.org/content/space-background-8
- Alien Bug: https://opengameart.org/content/8-bit-alien-assets

The spaceship was made by Ritza. 

## Things to Try Next

Games can have almost infinite scope, but here are a few things you can try add in to polish it up:

- Self healing on the shield. Perhaps add back 1 or 2 shield points every 10 seconds, so that players can go further if they dodge the aliens.
- A better ending screen, with the player's score.
- An intro scene, explaining the game and the controls.
- Different types of alien bugs - perhaps a large "boss" bug that could also shoot back.




