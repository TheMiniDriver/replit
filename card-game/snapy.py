from unittest import case
import pygame
from card import *
from engine import *


# Game loop
pygame.init()
bounds = (1024, 768)
window = pygame.display.set_mode(bounds)
pygame.display.set_caption("SnaPy")


cardY = 200

run = True

gameEngine = SnapEngine()

cardBack = pygame.image.load('images/BACK.png')
cardBack = pygame.transform.scale(cardBack, (int(238*0.8), int(332*0.8)))

def renderGame(window):
  font = pygame.font.SysFont('comicsans',60, True)
  topCard = gameEngine.pile.peek()
  if (topCard != None):
    window.blit(topCard.image, (400, cardY))

  window.blit(cardBack, (100, cardY))
  window.blit(cardBack, (700, cardY))

  text = font.render(str(len(gameEngine.player1.hand)) + " cards", True, (255,255,255))
  window.blit(text, (100, 500))

  text = font.render(str(len(gameEngine.player2.hand)) + " cards", True, (255,255,255))
  window.blit(text, (700, 500))

  if gameEngine.state == GameState.PLAYING:
    text = font.render(gameEngine.currentPlayer.name + " to flip", True, (255,255,255))
    window.blit(text, (20,50))

  if gameEngine.state == GameState.SNAPPING:
    result = gameEngine.result
    if result["isSnap"] == True:
      message = "Winning Snap! by " + result["winner"].name
    else:
      message = "False Snap! by " + result["snapCaller"].name + ". " + result["winner"].name + " wins!"
    text = font.render(message, True, (255,255,255))
    window.blit(text, (20,50))

  if gameEngine.state == GameState.ENDED:
    result = gameEngine.result
    message = "Game Over! " + result["winner"].name + " wins!"
    text = font.render(message, True, (255,255,255))
    window.blit(text, (20,50))


while run:
  key = None; 
  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      run = False
    if event.type == pygame.KEYDOWN:
      key = event.key

  window.fill((15,0,169))


  gameEngine.play(key)
  renderGame(window)
    
  pygame.display.update()
  if gameEngine.state == GameState.SNAPPING:
    pygame.time.delay(3000)
    gameEngine.state = GameState.PLAYING

