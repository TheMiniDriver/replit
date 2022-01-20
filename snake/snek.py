import pygame
from food import Food
from snake import * 

# Game loop
pygame.init()
bounds = (300,300)
window = pygame.display.set_mode(bounds)
pygame.display.set_caption("Snek")

block_size = 20
snek = Snake(block_size, bounds)
food = Food(block_size,bounds)
font = pygame.font.SysFont('comicsans',60, True)

run = True
while run:
  pygame.time.delay(100)

  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      run = False

  keys = pygame.key.get_pressed()
  if keys[pygame.K_LEFT]:
    snek.steer(Direction.LEFT)
  elif keys[pygame.K_RIGHT]:
    snek.steer(Direction.RIGHT)
  elif keys[pygame.K_UP]:
    snek.steer(Direction.UP)
  elif keys[pygame.K_DOWN]:
    snek.steer(Direction.DOWN)

  snek.move()
  snek.check_for_food(food)
  if snek.check_bounds() == True or snek.check_tail_collision() == True:
    text = font.render('Game Over', True, (255,255,255))
    window.blit(text, (20,120))
    pygame.display.update()
    pygame.time.delay(1000)
    snek.respawn()
    food.respawn()

  window.fill((0,0,0))
  snek.draw(pygame, window)
  food.draw(pygame, window)
  pygame.display.update()
# end while loop

pygame.quit()