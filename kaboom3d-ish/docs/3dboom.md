# Building a psuedo 3D Game in Kaboom

3D games became very popular in the late 80's and early 90's, with games like the early Flight Simulator, Wolfenstein 3D, etc. These early games were mainly [2.5D, or psuedo 3D](https://en.wikipedia.org/wiki/2.5D) - basically the action really takes place in 2 dimensions, but the world appears to be 3D. 

Since Kaboom.js is a 2D game engine, we'll apply some of those techniques to create a psuedo 3D game, while using as much of Kaboom's useful functions as possible. The game is roughly based on the [2D space shooter](https://docs.replit.com/tutorials/24-build-space-shooter-with-kaboom) tutorial, but instead of the side platformer view, we create a view from the cockpit of the spaceship. 

![Intro Game Screenshot](game.png)

You can download this [zip file](link) with all the sprites and sounds you'll need for this tutorial.

## Game Designs

These are some of the main aims of the game:

- Sense of depth, to create the 3D illusion
- Feeling of freedom of movement throughout the space

To achieve the sense of depth, we'll make use of [scaling](https://kaboomjs.com/#scale) sprites, representing them as smaller if they are meant to be further away, and larger when they are closer. To create a feeling of space, we'll implement an algorithm to create a star field that we fly through, like the early Windows screensavers. 

## Creating a new Project in Replit

Head over to [Replit](https://replit.com) and create a new repl. Choose **Kaboom** as your project type. Now, give this repl a name, like "Space Shooter Kinda 3D".

After the repl has booted up, you should see a `main.js` file under the "Scenes" section. This is where we'll start coding.

## Overview of Kaboom.js

[Kaboom.js](https://kaboomjs.com) is a Javascript library that contains a lot of useful features to make simple browser games. It has functionality to draw shapes and sprites (the images of characters and game elements) to the screen, get user input, play sounds and more. We'll use some of these features in our game to explore how it works. 

The Kaboom Replit interface is specialised for game-making as well. Besides the Space Invader icon, you'll notice a few special folders in the file try, like "Scenes", '"Sprites", and "Sounds". These special folders take care of loading up assets, and all the neccessary code to start scenes and direct the game. You can read up more about this interface [here](https://docs.replit.com/tutorials/kaboom). 

If you haven't already, download this [zip file](link) which contains all the sprites and sounds for the game. Extract the file on your computer, then add the sprites to the "Sprites" section in the Replit editor, and the sounds to the "Sounds" section.

Kaboom.js also makes good use of Javascript's support for [callbacks](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) - instead of writing loops to read in keyboard input and check if game objects have collided (bumped into each other), Kaboom.js uses an event model, where it tells us when these things have happened. Then we can connect up [callback functions](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) that act on these events. 

Kaboom also works on the idea of "Scenes". Scenes are like levels, or different parts and stages of a game. The IDE has a default "main" scene already, which we can use for our main game code. Inside Scenes, we can have multiple "Layers". This allows us to have backgrounds that don't affect the game, main game objects (like the player, bullets, enemies etc), and also UI elements (like the current score, health etc). 

## Creating the Interface Layers

Add the following code to the `main.js` file to create the 3 layers "Background (`bg`)", "Object (`obj`)", "User Interface (`ui`): 

```javascript
layers([
    "bg", 
    "obj", 
    "ui", 
], "obj"); 
```

The `obj` layer is set as the default layer, which is where the game action takes place. We'll use the `bg` layer to draw the star field on, as we don't interact with the objects on that layer. Then we'll use the `ui` layer to draw fixed foreground object, like the cockpit of the spaceship the player is travelling in. 


## Creating Alien Bugs 

As in the [2D version of this game](https://docs.replit.com/tutorials/24-build-space-shooter-with-kaboom), the main challenge will be avoiding and shooting down exploding alien bugs. This time, instead of the bugs coming from the left and right of the screen, we will try make it appear as though they are coming toward the player from "inside" the screen. 

To create this effect, we'll start by making the alien bugs small and spread out over the screen. As they get closer, we'll make them larger, and make them loom large toward the center of the screen, to give the effect that the are getting closer. 


Practically, we need a 3D co-ordinate system to work out how everything should move. We'll create a system like the one in the image, with 0 for all three dimension axis in the center. This is how we'll track the movements of the aliens in code. When we draw them to the screen, we'll convert these co-ordinates into the 2D screen co-ordinate system. 

![3D co-ordinate system](3d-system.png)

Let's try some code to achieve this, and explain as we go. Add the following the the `main` scene file. 

```js
const SCREEN_WIDTH = 320; 
const SCREEN_HEIGHT = 200; 
const ALIEN_SPEED = 200; 


let aliens = []; 

function spawnAlien(){
    const x = rand(0 , SCREEN_WIDTH); 
    const y = rand(0 , SCREEN_HEIGHT); 

    var newAlien = add([
        sprite("alien"), 
        pos(x,y), 
        scale(0.2), 
        rotate(0),
        {
            xpos: rand(-1*SCREEN_WIDTH/2, SCREEN_WIDTH/2), 
            ypos: rand(-1*SCREEN_HEIGHT/2, SCREEN_HEIGHT/2),
            zpos: 1000, 
            speed: ALIEN_SPEED + rand(-0.5* ALIEN_SPEED, 0.5*ALIEN_SPEED)
        }, 
        "alien"
    ]);

    aliens.push(newAlien); 
}

loop(0.8, spawnAlien); 
```

First, we define some general constants for the size of the screen, and the speed at which aliens should move at, so we don't have to keep remembering and typing numbers. It also makes it easier to change later. We also create an array to hold each alien object we create, so we can keep track of all of them, especially when we start moving them. 

The function `spawnAlien` creates a new alien at a random location on the screen. The first lines calculate a random x and y position to place the alien on the screen initially. This is logically not really needed, as you'll later we calculate the alien's actual position from our 3D co-ordinate system and calculate the projected screen position each frame. However, we need to pass a position [`pos`](https://kaboomjs.com/#pos) to the [`add`](https://kaboomjs.com/#add) method when we create a new object, so a random position is as good as any. 

We add a 2 other components as well when constructing the alien object: 


-[`scale`](https://kaboomjs.com/#scale), which will allow us to adjust the size of the alien over time, making it seem to becoming closer to the screen. 
-[`rotate`](https://kaboomjs.com/#rotate) to enable us to rotate the aliens so we can simulate 'rolling' when changing direction in the spaceshift

The code also adds custom properties to the alien object. These are the the co-ordinates of the alien's position in the 3D system. We start with a fixed `zpos`, or position on the Z axis far from the screen. We also set a speed for the alien, varied by a random amount up to half the base speed, faster or slower. This is to have some variety in the way aliens approach the ship. These custom values will be used as we calculate the screen position of the alien each frame. 

Finally, we add the new alien to the `aliens` array we created earlier, to keep track of it. 

Outside the function, we make use of the Kaboom [`loop`](https://kaboomjs.com/#loop) functionality to call the `spawnAlien` function to create a new alien at regular intervals. 

## Moving the Alien Bugs

Now that we can generate alien bugs at a regular interval, we can move on to moving them each frame.  

```js
    action("alien", (alien)=>{
        alien.zpos -= alien.speed * dt();

        alien.scale = 2 - (alien.zpos * 0.002);

        const centerX = SCREEN_WIDTH * 0.5; 
        const centerY = SCREEN_HEIGHT *0.25;

        alien.pos.x  = centerX + alien.xpos * (alien.zpos * 0.001);
        alien.pos.y = centerY + alien.ypos * (alien.zpos * 0.001);

        if (alien.zpos <= 1 ){
            destroyAlien(alien); 
        }
    }); 

    function destroyAlien(alien){
        aliens = aliens.filter(a => a != alien); 
        destroy(alien); 
    }
```

First, we add a new event handler onto the [`action`](https://kaboomjs.com/#action) event, and filter for any objects tagged `alien`. The `action` event handler is fired for each frame. In this event handler function, we adjust the `zpos` of the alien to make it 'move' a little closer to the screen. We use the [`dt()`](https://kaboomjs.com/#dt) function to get the time from the last frame, along with the speed per second we assigned to the alien when we constructed it, to calculate the new `zpos`. Once we have that new value calculated in our 3D co-ordinate system, we can translate it to screen co-ordinates, and mimic the z-axis position by adjusting the size, or scale, of the alien sprite. 

Recall that screen co-ordinates start with 0,0 at the top left corner of the screen, and our 3D co-ordinate system starts with 0,0,0 in the 'center' of the system. To translate between the 2 systems, we need to find the center of the screen in screen coordinates (by halving the screen `WIDTH` and `HEIGHT` by 2) , and center the 3D system over that. The screen is the red rectangle in the below image, showing how the 3D system will be centered in it. 

![overlay 3d system over 2d system](overlay.png)


Then we can add the alien's `x` and `y` positions in 3D co-ordinate space to the center point of the screen. We bias the center point "up" a bit, as this will seem to be the center of the spaceship's view when we add it later. We also modify each of these `x` and `y` positions by a factor relating to the alien's `z` position. Essentially, the further away the alien's are, (when the `zpos` is a larger number, like 1000), ,the aliens will be spread out randomly on the screen. However, as the `zpos` decreases, and the alien gets nearer, the factor will draw the alien nearer to the center of the screen. This makes it feel to the player that the aliens are coming at them, and enhance the depth illusion. 

Finally, we see if the alien is very close, by seeing if the `zpos < 10`. If it is, we destroy the alien, to remove it from the scene, as it is has either gone past our spaceship, or crashed into it. We create small helper function `destroyAlien` to manage this, as we also need to remove the alien from the tracking array. 

If you run the code now, you should see the aliens start to move toward you. 

![aliens coming at you](link)

## Adding a Star Field

Now that we have the aliens moving and coming at us, we need to add another element to give a further sense of depth and show that we are in outer space. Enter the star field generator. This is probably best known from old screensavers. We can implement it in a very similar way as we did for the aliens. One difference will be that we will use color, or more specifically _intensity_, to proxy for the `z-axis`, instead of scaling. The other difference is that instead of making the stars get closer to the center of the screen as if they are coming at us, we'll make then spread further from the center, so it always looks like we are going past the stars. It also makes it seem like we are travelling at warp speed, which is always cool. 


```js
const STAR_COUNT = 1000; 
const STAR_SPEED = 5; 
var stars = []; 

function spawnStars(){
    for (let i = 0; i < STAR_COUNT; i++) {
        const newStar = {
          xpos: rand(-0.5*SCREEN_WIDTH, 0.5*SCREEN_WIDTH),
          ypos: rand(-0.5*SCREEN_HEIGHT, 0.5*SCREEN_HEIGHT),
          zpos: rand(1000)
        };
        stars.push(newStar);
    }
}

spawnStars(); 

action(()=>{
  const centerX = SCREEN_WIDTH * 0.5; 
  const centerY = SCREEN_HEIGHT * 0.5;
  
  stars.forEach((star)=>{
    star.zpos -= STAR_SPEED; 
    if (star.zpos <=1)
    {
      star.zpos = 1000; 
    }
    const x = centerX + star.xpos / (star.zpos * 0.001);
    const y = centerY + star.ypos / (star.zpos * 0.001);

    if (x>= 0 && x<= SCREEN_WIDTH && y>=0 && y<= SCREEN_HEIGHT) {
      const scaled_z = star.zpos * 0.0005;
      const intensity = 1 - scaled_z;

      drawRect(vec2(x,y), 1, 1, {
        color: rgb(intensity, intensity, intensity)
      });  
    }
  })
});
```

This is very similar to the alien code we added above. If we look at the `spawnStars` function, a few differences to the `spawnAlien` function are:

- We create all the stars at once - these is because we need a significant star field to start with, i.e not just a few every second. 
- We don't create a Kaboom object for each star. This is because we don't need the collision handling and other overhead that comes with a Kaboom object, especially since we are generating a lot of stars (`const STAR_COUNT = 1000; `). Instead, we store the stars info in custom [object literals](link), and add each of these to the `stars` array.  
- Another difference is that we set the intial `z-pos` of the stars to a random value from 0 to 1000, using the Kaboom [`rand`](https://kaboomjs.com/#rand) function. We do this because we create all the stars at once, so to get an initial feeling of depth, we need the seed the stars at various positions on the z-axis. Another reason is that if they were all initialised to the same `z-pos`, they would move in unison, and it would look like a mass of pixels were coming at us - a bit weird!

Then looking at the difference between the [`action`](https://kaboomjs.com/#action) event handler, there are a few things to note:

- We don't use an object filter to look for the stars, as we didn't create them as Kaboom objects. Instead, we just cycle through each star in the `stars` array. 
- Instead of destroying the star and removing it from the array when it reaches the 'front' of the screen, we recycle it by resetting its `z-pos` back to 1000. 
- We also check if the star is out of the screen view. If it is, we don't draw it, to save a bit of overhead. 
- Instead of using the `z-pos` to calculate a value to scale the star, we use it to calculate an intensity, or brightness. Kaboom uses color values in the range 0-1. So first, we scale the `z-pos` down to below 1. Then we subtract it from 1 (maximum color value, i.e brightest value) to create an inverted relationship between `z-pos` and intensity. In other words, the higher the `zpos`, meaning the further away the star is, the lower the color intensity. This makes stars far away glow dimly, while ones closer to our view look brighter. 
- Finally, we use the Kaboom.js [drawRect](https://kaboomjs.com/#drawRect) method to directly draw the star to the screen. As there is no pixel level drawing function in Kaboom, we create a rectangle of size 1 to draw just one pixel. 

## Adding the Spaceship Cockpit

Now that we've got a place to fly through, let's add the player's spaceship. We'll make the game from the point of view of the spaceship pilot. Add the following code to add a view from the spaceship cockpit.

```js
    const cockpit = add([
        sprite("cockpit"),
        layer("ui"), 
        rotate(0),
        pos(SCREEN_WIDTH/2, SCREEN_HEIGHT/2 ),
        origin("center"), 
        scale(0.275)
    ]);
```

This adds the `cockpit` sprite (image) to the `ui` layer. We also add the [`rotate`](https://kaboomjs.com/#rotate) component to it, so that we can add some rotation effects when we are flying the spaceship. Then we use the [`origin`](https://kaboomjs.com/#origin) component to center the image in the middle of the screen, and also make the center to axis to rotate the sprite around when banking (turning) the spaceship. Then we use a scaling factor to [`scale`](https://kaboomjs.com/#scale) the image down to the size of the screen. We do this as the size of the image is much larger (1334×834) than the size of the game screen (320x200). We could resize the image in a image editing programme, but we would lose some detail and sharpness. Note that the factor of the scale means that the image still ends up a little larger than the screen size. We do this so there is a bit of overlap available for when we rotate the image when banking the spaceship. 

Running the game now, you should see the view from inside the spaceship. 

![spaceship view](spaceship-view.png)


## Creating Controls to Move Direction

We've got a basic game world up and running - lets add some controls so we can move around in it. We'll allow a few different moves for the spaceship - bank left or right and fly up and down. A fundemental question to ask is how exactly do we fly around the game world? We can't move the cockpit left, right, up or down - it would just disapear off screen. One way of simulating movement from the cockpit point of view is to move all the other game elements, while keeping the cockpit stationary. 

To achieve this, lets add some helper functions to move the game objects. 

```js
function shiftAliens(x, y){
    aliens.forEach((alien) =>{
        alien.xpos += x / (alien.zpos*0.01); 
        alien.ypos += y / (alien.zpos*0.01);  
    }); 
}

function shiftStars(x, y){
    stars.forEach(star =>{
        star.xpos += x *0.01; 
        star.ypos += y *0.01; 
    });
}
```
These 2 functions take values for the amounts we want to "move" by, and moves the aliens and the stars. In each case, we loop through the arrays holding the alien or star game objects. There are some adjustments made to the values supplied to the functions. This is to account for the perception that objects further away appear to move "less" than objects close to us when we move. In the case of the stars, we assume they are all in the far distance, so we scale down the amounts to move by a constant factor. In the case of the aliens, some are far away, while others are right up against the spaceship. To account for this, we adjust the amounts to move the alien by a factor relating to it's distance from us, or `zpos`. Aliens very close will move much more than those far away. 

Now we can add some event handlers for keyboard input. 

```js
    const MOVE_DELTA = 2000; 

    keyDown("left", () => {
        const delta =  MOVE_DELTA * dt(); 
        shiftAliens(delta, 0);
        shiftStars(delta*0.01, 0);
        camRot(0.1);
    });

    keyDown("right", () => {
        const delta =  -1 * MOVE_DELTA * dt(); 
        shiftAliens(delta, 0);
        shiftStars(delta*0.01, 0);
        camRot(-0.1);
    });


    keyDown("up", () => {
        const delta =  -1 * MOVE_DELTA * dt(); 
        shiftAliens(0, delta);
        shiftStars(0,delta*0.01);
    });

    keyDown("down", () => {
        const delta = MOVE_DELTA * dt();
        shiftAliens(0, delta);
        shiftStars(0, delta*0.01);
    });

    keyRelease("left", ()=>{
        camRot(0);
    }); 

    keyRelease("right", ()=>{
        camRot(0);
    }); 
```

Here we use the Kaboom events [`keyDown`](https://kaboomjs.com/#keyDown) and [`keyRelease`](https://kaboomjs.com/#keyRelease) to attach event handlers for direction controls to the arrow keys on the keyboard. In each of the `keyDown` event handlers, we get the time elapsed from the last frame by calling the [`dt()`](link) function, and multiply that by a constant `MOVE_DELTA` representing the amount to move by each second. For moving left or down, we also make the amount to move negative - recall that we are moving the objects in our 3D co-ordinate system. Then we call the 2 helper functions we defined above with the amount to move the objects in the `x` and `y` dimensions. 

In the `left` and `right` key event handlers, we also make use of the Kaboom [`camRot`](https://kaboomjs.com/#camRot) effect. This effect rotates all objects by the amount we specify, giving the perception of banking hard while turning. We add in two additional event handlers on  [`keyRelease`](https://kaboomjs.com/#keyRelease) for the `left` and `right` keys to reset the rotation when the player stops turning. 


Give this a run, and you should be able to control the spaceship. 

![flying controls][fly-controls.gif]


## Adding Weapons

Now that we are flying through the alien bug field, we'll need some weapons to shoot them, as if they contact the spaceship, they will explode and damage us. For this, we'll need to implement some lasers. Firstly, we'll need a cross hairs to show where will be shooting at. 

```js
const vertical_crosshair = add([
    rect(1, 10),
    origin('center'),
    pos(SCREEN_WIDTH*0.5, SCREEN_HEIGHT*0.33),
    color(0, 1, 1),
    layer("ui")
]);

const horizontal_crosshair = add([
    rect(10, 1),
    origin('center'),
    pos(SCREEN_WIDTH*0.5, SCREEN_HEIGHT*0.33),
    color(0, 1, 1),
    layer("ui")
]);

```
This adds 2 lines to a point halfway across the screen, and about 1/3 down the screen, which is about the center of the view out of the spaceship window. Since Kaboom doesn't have a line component, we use [`rect`](https://kaboomjs.com/#rect) to draw rectangles with a width of 1 pixel, which effectively draws a line. We also add the cross hairs to the UI layer, so they are always on top of the aliens and stars. 

Now we have a point to aim at, let's add the lasers. We want a classic laser effect, where we shoot 2 lasers from each side of the ship towards the same point. This will give the effect of us shooting into the distance, towards a vanishing point. 

```js


const BULLET_SPEED = 10;
function spawnBullet() {

    const BULLET_ORIGIN_LEFT = vec2(SCREEN_WIDTH *0.25, (SCREEN_HEIGHT - SCREEN_HEIGHT*0.33)); 
    const BULLET_ORIGIN_RIGHT = vec2(SCREEN_WIDTH - (SCREEN_WIDTH*0.25), (SCREEN_HEIGHT - SCREEN_HEIGHT*0.33)); 

    const BULLET_VANISHING_POINT = vec2(SCREEN_WIDTH * 0.5, SCREEN_HEIGHT *0.33); 

    add([
        rect(1, 1),
        pos(BULLET_ORIGIN_LEFT),
        color(1, 0, 0),
        "bullet",
        {
            bulletSpeed:  BULLET_SPEED , 
            targetPos: BULLET_VANISHING_POINT
        }
    ]);

    add([
        rect(1, 1),
        pos(BULLET_ORIGIN_RIGHT),
        color(1, 0, 0),
        "bullet",
        {
            bulletSpeed:  -1*BULLET_SPEED, 
            targetPos: BULLET_VANISHING_POINT
        }
    ]);

    play("shoot", {
        volume: 0.2,
        detune: rand(-1200, 1200),
    });
}
```

We have quite a lot going on in this code. Let's look at the `spawnBullet` function. We'll call this function when the player fires, to create a new set of laser bullets. First, we calculate the position the bullets will be coming from. We want to make it seem as though they are coming from under the spaceship, on either side. To do this, we work out positions a quarter way from the sides of the screen, and about a third of the way from the bottom, using the multipliers `0.25` and `0.33` respectively. 

Then we calculate where we want the bullets to end up. This is the some position as the cross hairs.  

Using these values, we then create 2 bullet objects - simple 1 pixel objects, with a tag `bullet`, and the color set to red `(1,0,0` so they look menacing. We also add custom properties to the object: A speed for the bullet to move at, and the vanishing point where we want them to end up. 

After create the bullets, now we can move them each frame, to make them go from their origin point to the vanishing point at the cross hairs. 

```js
action("bullet", (b) => {

    const m = (b.pos.y - b.targetPos.y) / (b.pos.x - b.targetPos.x); 
    const c = b.targetPos.y - m*(b.targetPos.x); 

    let newX = b.pos.x + b.bulletSpeed; 
    let newY = m * newX + c; 
    b.pos.x = newX
    b.pos.y = newY;
    // Remove the bullet once it has hit the vanishing point y line
    if ((b.pos.y < SCREEN_HEIGHT*0.33)) {
        destroy(b);
    }
});

keyDown("space", () => {
    spawnBullet(); 
});

```
Here we use the [`action`](https://kaboomjs.com/#action) event handler, filtered to `bullet` objects. In this function, we calculate the slope and intersection parameters of a straight line between the bullet's current position and it's end target position. We need these parameters to calculate the next position of the bullet on the firing line. The parameters are derived from the [equation for a straight line](https://www.mathsisfun.com/equation_of_line.html)

```js
y = m*x + c
```

We have both the start and end `x` and `y` co-ordinates, so we can use them to solve for the unknowns `m` and `c`, using the method of solving simultaeous equations. 

```
y_start = m*x_start + c         (1)
y_target = m*x_target + c       (2)

re-arranging (2):
c = y_target - m*x_target

Substitute (2) into (1) for c:
y_start = m*x_start + (y_target - m*x_target)
y_start - y_target  = m*x_start - m*x_target
                    = m*(x_start - x_target)
so m = (y_start - y_target) / (x_start - x_target)

Now we can solve for c:
c = y_target - m*x_target

```
Using the math above, we can understand what the first 2 lines of the method are doing. Now that we have the parameters needed to calculate the bullet's trajectory on the line, we can advance the bullet's current `x` position by the bullet speed amount. Then using the equations above, we can figure out the corresponding new `y` position. Then we update the bullets `pos`, or position, to these new values. 

Because we want the bullets to disappear once they hit the target at the vanishing point, we check if the bullet has crossed the horizontal cross hair line. If it has, we remove the bullet from the scene using the [`destroy`](https://kaboomjs.com/#destroy) function. 

Finally, we have an event handler for the `space` key, which calls the `spawnBullet` function whenever it is pressed. 

Try this out now, and you should be able to shoot some laser bullets into space. 

![Shooting](shooting.gif)


## Checking for Collisions with Bullets

Now that we can shoot bullets, we need to detect if they hit an alien bug, so we can explode them. 

```js
const BULLET_SLACK = 10; 
collides("alien","bullet", (alien, bullet) =>{
    if (bullet.pos.y > SCREEN_HEIGHT*0.33 + BULLET_SLACK) return; 
    makeExplosion(bullet.pos, 5, 5, 5);
    destroy(alien); 
    destroy(bullet);  
}); 

```

We make use of the Kaboom event [`collides`](https://kaboomjs.com/#collides) which is fired when 2 game objects are overlapping or touching each other. We pass in the tags for the aliens and bullets, so we know when they collide. 
We want to limit bullet hits to only be around the target area, so that the 3D perspective is kept. But because they could collide at any point along the path the bullet takes, we check if the collision has taken place at around the cross hairs area. Then, if is in the target zone, we remove both the bullet and the alien from the scene, and call a function to create an explosion effect. This is the same code used in the [2D Space Shooter](https://docs.replit.com/tutorials/24-build-space-shooter-with-kaboom) tutorial. 

```js
function makeExplosion(p, n, rad, size) {
        for (let i = 0; i < n; i++) {
            wait(rand(n * 0.1), () => {
                for (let i = 0; i < 2; i++) {
                    add([
                        pos(p.add(rand(vec2(-rad), vec2(rad)))),
                        rect(1, 1),
                        scale(1 * size, 1 * size),
                        lifespan(0.1),
                        grow(rand(48, 72) * size),
                        origin("center"),
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
We won't explain this code here, but if you'd like to know how it works, visit the [2D Space Shooter tutorial](https://docs.replit.com/tutorials/24-build-space-shooter-with-kaboom) to learn more. 

Run this now, and you should be able to shoot the alien bugs down. 


## Checking if Alien Bugs hit the Spaceship

Now we can add functionality to check if an alien bug makes it past our laser and explodes into the spaceship. Since the cockpit covers the entire screen, we can't make use of the [`collides`](https://kaboomjs.com/#collides) function to check if an alien has hit the cockpit, as it would always be colliding. Instead, we can check the `z` value of the alien, plus if it is within an area of the spacecraft that would cause damage. We'll use a "strike zone" in the center of the cockpit view as the area that aliens can do damage to the craft. Outside that area, we'll assume that the aliens go around, or up or over the spacecraft. 

To implement this scheme, add a definition for the strike zone: 

```js
const STRIKE_ZONE = {x1:80, x2:240, y1:20, y2:100};

```

Then we can modify the `action("alien",....)` event handler that we added earlier in the "Moving the Alien Bugs" section. In the part of the function where we check if the alien is close to us (`if (alien.zpos <= 1 )`), update the code as follows:

```js
   if (alien.zpos < 1 ){
            //check if the alien has hit the craft 
            if (alien.pos.x >= STRIKE_ZONE.x1 && 
                alien.pos.x <= STRIKE_ZONE.x2 && 
                alien.pos.y >= STRIKE_ZONE.y1 && 
                alien.pos.y <= STRIKE_ZONE.y2){
                    camShake(20); 
                    makeExplosion(alien.pos, 10, 10, 10);
            }
            destroyAlien(alien); 
    }
```

We've modified the code to check if the alien is really close to us (`alien.zpos < 1 `), and if it is, we check if it is within the bounds of the `STRIKE_ZONE` area. The strike zone is a rectangle - you could implement more complex shapes if you wanted to be more accurate about where the alien can hit. However, a rectangle approximation is OK for this game. 

If the alien is close enought, and within our strike zone, we use the [`camShake`](https://kaboomjs.com/#camShake) effect to make it "feel" like we've been hit. Then we create an explosion at the point of impact as well, for some visual effects. 


## Finishing up the Game

Congratulations, we've got all the main elements of flying and shooting and damage in the game. The next thing to do would be to add a scoring system, and a way to reduce the spaceships health or shield when it gets hit. We won't go into that in this tutorial, but you can look at the [2D tutorial version of this game](https://docs.replit.com/tutorials/24-build-space-shooter-with-kaboom), and copy the scoring and health code from that into this game. You can also copy the code for background music and more sound effects etc. 

Happy coding and have fun!

## Credits

The game art and sounds used in this tutorial are from the following sources:

Laser : https://freesound.org/people/sunnyflower/sounds/361471/
Explosion: https://freesound.org/people/tommccann/sounds/235968/
Alien Bug: https://opengameart.org/content/8-bit-alien-assets

The spaceship cockpit was made by Ritza.

Thank you to all the creators for putting their assets up with a Creative Commons license and allowing us to use them.





