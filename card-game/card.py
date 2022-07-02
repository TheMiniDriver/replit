from enum import Enum
import random
import pygame

class Suites(Enum):
  CLUB = 0
  SPADE = 1
  HEART = 2
  DIAMOND = 3

class Card:
  suite = None
  value = None
  image = None
  def __init__(self, suite, value):
    self.suite = suite
    self.value = value
    self.image = pygame.image.load('images/' + self.suite.name + '-' + str(self.value) + '.svg')


class Deck:
  cards = None
  def __init__(self):
    self.cards = []
    for suite in Suites:
      for value in range(1,14):
        self.cards.append(Card(suite, value))
        
  def shuffle(self):
    random.shuffle(self.cards)
    
  def deal(self):
    return self.cards.pop()

  def length(self):
    return len(self.cards)

  def __str__(self):
    return str(self.cards)



class Pile:
  cards = None
  def __init__(self):
    self.cards = []
  def add(self, card):
    self.cards.append(card)
  def pop(self):
    return self.cards.pop()
  def popAll(self):
    return self.cards; 
  def clear(self):
    self.cards = []
  def peek(self):
    if (len(self.cards) > 0):
      return self.cards[-1]
    else:
      return None
  def isSnap(self):
    if (len(self.cards) > 1):
      return (self.cards[-1].value == self.cards[-2].value)
    return False
  def __str__(self):
    return str(self.cards)


class Player:
  hand = None
  flipKey = None
  snapKey = None
  name = None

  def __init__(self, name, flipKey, snapKey):
    self.hand = []
    self.flipKey = flipKey
    self.snapKey = snapKey
    self.name = name
  def draw(self, deck):
    self.hand.append(deck.deal())
  def play(self):
    return self.hand.pop(0)
  def __str__(self):
    return str(self.hand) + str(self.pile)