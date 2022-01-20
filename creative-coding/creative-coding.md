# Creative Coding with Replit

If you're into creating graphics, 3D worlds, games, sounds and other more creative things, Replit has a number of tools and environments to help you. One of the big benefits of Replit is that you can switch and try out different programming paradigms without the hassle and time of setting it all up yourself. 


## What is creative coding?

For this article, we'll consider a tool a creative coding one if it's main purpose is to create graphics, visual models, games or sounds. Things like plain HTML or javascript can, and often are, used for this, but we're looking for tools and languages that are a bit more specialised. We won't go into much detail for each - we just want to create a list of possibilities. 

Here is a list of the templates of the more creative side of Replit

### Python Turtle 

Turtle graphics is a classic of the genre. It was first created way back in the 1960's! The idea is that there is a small turtle robot on the screen, holding some pens. You get to give it commands to move around and tell it when to put the pen down and what color pen to use. This way you can make line, or vector, drawings on the screen. The turtle idea comes from a type of actual robot used for education. 

Replit has Python Turtle, which is the current day incarnation of the turtle graphics idea. Choose the 'Python (with Turtle)' template when creating a new repl to use it. 

![turtle-template](turtle-template.png)

Python turtle uses commands like `forward(10)`, `back(10)`, `left(50)`, `right(30)` `pendown()` and `penup()` to control the turtle. The methods `forward` and `back` take the distance the turtle should move as their arguments, while `left` and `right` take the angle in degrees to turn the turtle on the spot (the turtle is very nimble!). `pendown` and `penup` tells the turtle to draw or not draw while moving.

When you create a new Python Turtle template, you'll notice that there is already a small program as an example to show you the basics. If you run it, it should draw a square, with each side a different color. 

![turtle square](turtle-square.png)

Although Turtle has a small set of simple commands, it can still be used to make some impressive looking graphics. This is because you can use loops and calculations and all the other programming constructs availalble in Python to control the turtle. 

Try this Turtle program for example: 


```python
import turtle

t = turtle.Turtle()
t.speed(0)

sides = 3;
colors = ['red', 'yellow', 'orange']

for x in range(360):
    t.pencolor(colors[x % sides])
    t.forward(x * 3 / sides + x)
    t.left(360 / sides + 1)
    t.width(x * sides / 200)

```

You should see a spiral made from drawing a slightly rotated and increasingly larger triangle for each of the 360 degrees specified in the main loop. This short little script produces a cool looking output:

![turtle spiral](turtle-spiral.png)

Try changing up the `sides` parameter to draw different shapes, and play with the color combos to come up with new artworks. 


### p5.js 

[P5.js](https://p5js.org) is a JavaScript graphics and animation library aimed at artists and designers - and generally people who have not been exposed to programming before. P5.js is based on the [Processing](https://processing.org) project. P5.js brings the Processing concept to web browsers, making it easy to share your "sketches", which is P5's name for programs.

Replit has 2 templates for p5 - one for pure JavaScript, and another that interprets Python code, but still uses the underlying p5.js JavaScript library. You can use the Python version if you are more familiar with Python syntax than JavaScript syntax. 

![p5 templates](p5-templates.png)

If you create a repl using one of the templates, you'll see that there is some sample code. Running it will draw random color circles on the screen wherever the mouse pointer is. 

![p5 sample sketch output](p5-circles.png)


P5.js has 2 main functions in every sketch 
- `setup()`, which is run once when the sketch is executed.
- `draw()`, which is run every frame.


In the `setup` function, you generally setup the window size and other such parameters. In the `draw` function, you can use [P5.js's functions](https://p5js.org) to draw your scene. P5.js has functions to draw everything from a simple line to rendering 3D models. 

Here is another sketch you can try (note this is in JavaScript, so it will only work in the P5.js JavaScript template):

```js

function setup() {
  createCanvas(500, 500);
    background('honeydew');
}

function draw() {
  noStroke()
  fill('cyan');
  circle(450, 200, 100);
  fill('pink');
  triangle(250, 75, 300, 300, 200, 275);
  fill('lavender')
  square(250, 300, 200);
}
```

This draws a few shapes in various colors on the screen, in a kind of 80's geometric art style.  
![p5 shapes examples](p5-shapes.js)


The [p5.js website](https://p5js.org/get-started/) has a getting started guide, plus a lot of references and examples to experiment with. 

### Kaboom

Kaboom.js is Replit's own homegrown JavaScript game framework, launched earlier in 2021. It is geared towards making 2D games, particularly platform games, although it has enough flexibility to create games in other formats too. Because it is a JavaScript library, it can be used to develop web games, making it easy to share and distribute your creations with the world. 

Replit has 2 official templates for Kaboom: 

- A specialized Kaboom template, with an integrated sprite editor and gallery, as well as pre-defined folders for assets etc. This is perfect for getting started with Kaboom and making games in general, as you don't need to worry about sourcing graphics or folder structures. 
- A 'light' one, that is a simply a web template with just the Kaboom package referenced. This is more for coders with a little more experience, as the intent is to give you more control and flexibility


One of the great features of Kaboom is the simple way to define level maps, drawing them with text characters, and then mapping the text characters to game elements. 

```js
const level = [
		"                          $",
		"                          $",
		"                          $",
		"                          $",
		"                          $",
		"           $$         =   $",
		"  %      ====         =   $",
		"                      =   $",
		"                      =    ",
		"       ^^      = >    =   @",
		"===========================",
	];
```

Another interesting aspect of Kaboom is that it makes heavy use of [composition](https://en.wikipedia.org/wiki/Composition_over_inheritance). This allows you to create characters with complex behaviour by combining multiple simple components:

```js
    "c": () => [
      sprite("coin"),
      area(),
      solid(),
      cleanup(),
      lifespan(0.4, { fade: 0.01 }),
      origin("bot")
    ]
```

Kaboom has a fast growing resource and user base. The official [Kaboom site](https://kaboomjs.com) documents each feature, and also has some specific examples. There is also a site with complete tutorials for building different types of games at [MakeJsGames.com](https://makejsgames.com).

### PyGame

PyGame is a well established library (from 2000!) for making games. It has functionality to draw shapes and images to the screen, get user input, play sounds and more. Because it has been around for so long, there are plenty of examples and tutorials for it on the web.

Replit has a specialised Python template for PyGame. Choose this template for creating PyGame games:


![Pygame template](pygame-template.png)


Try out this code in a PyGame repl:

```python
import pygame

pygame.init()
bounds = (300,300)
window = pygame.display.set_mode(bounds)
pygame.display.set_caption("box")

color = (0,255,0)
x = 100
y = 100

while True:
  pygame.time.delay(100)
  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      run = False

  keys = pygame.key.get_pressed()
  if keys[pygame.K_LEFT]:
    x = x - 1
  elif keys[pygame.K_RIGHT]:
    x = x + 1
  elif keys[pygame.K_UP]:
    y = y - 1
  elif keys[pygame.K_DOWN]:
    y = y + 1

  window.fill((0,0,0))  
  pygame.draw.rect(window, color, (x, y, 10, 10))
  pygame.display.update()
    
```

This code initializes a new `pygame` instance and creates a window to display the output in. Then it has a main game loop, which listens for keyboard arrow key presses, and moves a small block around the screen based on the keys pressed. 


Check out some of our tutorials for PyGame :
- [2D Platform example](https://docs.replit.com/tutorials/14-2d-platform-game)
- [A Juggling game](https://docs.replit.com/tutorials/07-building-a-game-with-pygame)
- [Snake](https://docs.replit.com/tutorials/19-build-snake-with-pygame)

### Pyxel

[Pyxel](https://github.com/kitao/pyxel) is a specialised for making retro type games, inspired by console games from the 80's and early 90's. You can only display 16 colors, and only 4 sound samples can be played at once, just like on the earlier Nintendo, Sega and other classic systems. If you're into pixel art, this is the game engine for you. 

Choose the 'Pyxel' template on Replit to create a new Pyxel environment. 

![pyxel template](pyxel-template.png)

The template has some example code in it to get started. If you run it, you should see a new window with a  `Hello Pyxel!` message flickering in different colors, looking very 16 bit!

![hello pyxel](hello-pyxel.png)

Try this code in a Pyxel repl to draw a random size and color rectangles, changing every 2 frames: 

```python
import pyxel
import random

class App:

  def __init__(self):
    pyxel.init(160, 120, caption="Pyxel Squares!")
    pyxel.run(self.update, self.draw)

  def update(self):
    if pyxel.btnp(pyxel.KEY_Q):
        pyxel.quit()

  def draw(self):
    if (pyxel.frame_count % 2 == 0):
      pyxel.cls(0)
      pyxel.rect(random.randint(0,160), random.randint(0,120), 20, 20, random.randint(0,15))

App()
```

Take a look in the [examples](https://github.com/kitao/pyxel/tree/main/pyxel/examples) folder on the Pyxel github project to see more ways to use Pyxel. 


### GLSL

On the more advanced end of the spectrum, Replit supports GLSL projects. GLSL (OpenGL Shading Language) is a C-style language for creating graphics shaders. Shaders are programs that (usually) run on graphics cards as part of a graphics rendering pipeline. There are many types of shaders - the two most common are Vertex Shaders, and Fragment or Pixel Shaders. Verex shaders compute the position of objects in the graphics world, and Pixel Shaders compute the color that each pixel should be. This used to require writing code for specific graphics hardware, but GLSL is a high level language that can run on many different graphics hardware makes.

GLSL gives you  control over the graphics rendering pipeline, enabling you to create very advanced graphics. GLSL has many features to handle vector and matrix manipulations, as these are core to graphics processing.

Choose the "GLSL" template to create a new GLSL repl:

![GLSL template](glsl-template.png)

The template has a sample fragment shader in the file `shader.glsl` as well as some web code to setup a [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) resource to apply the shader to. Running the sample will show some pretty gradients on the screen that vary with time and as you move the mouse over it. 


Try this code out in the shader file. It will make a kind of moving "plaid" effect. 

```c
precision mediump float;
varying vec2 a_pos;
uniform float u_time;

void main(void) {
    
    gl_FragColor = vec4(
      a_pos.x * sin(u_time * a_pos.x),
      a_pos.y * sin(u_time * a_pos.y),
      a_pos.x * a_pos.y * sin(u_time), 
      1.0);
}
```

In the code, we are setting `gl_FragColor`, which is the color for a specific pixel on the screen. A pixel color in GLSL is represented using a vec4 data type, which is a vector of 4 values, representing Red, Green, Blue, Alpha. In this shader, we vary the pixel color depending on it's co-ordinate `a_pos`, and the current frame time `u_time`. 

If you'd like to dive deeper into the world of advanced graphics and shaders, you can visit [https://learnopengl.com/Getting-started/Shaders](https://learnopengl.com/Getting-started/Shaders).


## Wrap up

That wraps up this list of the official creative coding languages templates on Replit. Of course, Replit is flexible enough that you can import and use whatever framework or library you want in your projects, so you are not limited to the tools in this list. Replit is also adding more languages and templates everyday, so be sure to watch out for new additions!



