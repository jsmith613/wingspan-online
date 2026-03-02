import { BirdCardName } from '../../../src/common/cards/BirdCardName';
import { BonusCardName } from '../../../src/common/cards/BonusCardName';
import { FoodType } from '../../../src/common/game/FoodType';
import { HabitatType } from '../../../src/common/game/HabitatType';
import { NestType } from '../../../src/common/game/NestType';
import { PowerType } from '../../../src/common/game/PowerType';
import { createBirdCard, createBonusCard } from '../../../src/server/cards/createCard';
import { getRegisteredBirdNames, getRegisteredBonusNames } from '../../../src/server/cards/AllManifests';
import { AmericanRobin } from '../../../src/server/cards/base/AmericanRobin';
import { BlueJay } from '../../../src/server/cards/base/BlueJay';
import { CedarWaxwing } from '../../../src/server/cards/base/CedarWaxwing';
import { MourningDove } from '../../../src/server/cards/base/MourningDove';
import { NorthernCardinal } from '../../../src/server/cards/base/NorthernCardinal';
import { RedTailedHawk } from '../../../src/server/cards/base/RedTailedHawk';
import { DarkEyedJunco } from '../../../src/server/cards/base/DarkEyedJunco';
import { Player } from '../../../src/server/Player';
import { Game } from '../../../src/server/Game';
import { PlayerId, GameId } from '../../../src/common/Types';
import { Deck } from '../../../src/server/cards/Deck';
import { PowerEventBus, GameEvent } from '../../../src/server/powers/PowerEventBus';
import { selectGoalTiles, scoreRoundGoal, ALL_GOAL_TILES } from '../../../src/server/goals/GoalRegistry';
import { mulberry32 } from '../../../src/common/prng';

describe('BirdCard', () => {
  it('should create a bird card with correct properties', () => {
    const robin = new AmericanRobin();
    expect(robin.name).toBe(BirdCardName.AMERICAN_ROBIN);
    expect(robin.commonName).toBe('American Robin');
    expect(robin.habitats).toContain(HabitatType.FOREST);
    expect(robin.habitats).toContain(HabitatType.GRASSLAND);
    expect(robin.nestType).toBe(NestType.BOWL);
    expect(robin.eggCapacity).toBe(3);
    expect(robin.points).toBe(1);
    expect(robin.powerType).toBe(PowerType.BROWN);
  });

  it('should have correct default mutable state', () => {
    const robin = new AmericanRobin();
    expect(robin.eggs).toBe(0);
    expect(robin.cachedFood).toBe(0);
    expect(robin.tuckedCards).toBe(0);
  });

  it('should apply state from serialization', () => {
    const robin = new AmericanRobin();
    robin.applyState(3, 2, 1);
    expect(robin.eggs).toBe(3);
    expect(robin.cachedFood).toBe(2);
    expect(robin.tuckedCards).toBe(1);
  });

  it('should cache computed properties', () => {
    const robin = new AmericanRobin();
    expect(robin.totalFoodCost).toBe(2);
    expect(robin.totalFoodCost).toBe(2); // cached
    expect(robin.habitatSet.size).toBe(2);
    expect(robin.canLiveIn(HabitatType.FOREST)).toBe(true);
    expect(robin.canLiveIn(HabitatType.WETLAND)).toBe(false);
  });

  it('should convert to client card', () => {
    const robin = new AmericanRobin();
    robin.eggs = 2;
    const client = robin.toClientCard();
    expect(client.name).toBe(BirdCardName.AMERICAN_ROBIN);
    expect(client.eggs).toBe(2);
    expect(client.commonName).toBe('American Robin');
  });

  it('should convert to placed bird', () => {
    const robin = new AmericanRobin();
    robin.eggs = 1;
    robin.cachedFood = 3;
    const placed = robin.toPlacedBird();
    expect(placed.name).toBe(BirdCardName.AMERICAN_ROBIN);
    expect(placed.eggs).toBe(1);
    expect(placed.cachedFood).toBe(3);
  });
});

describe('createCard factory', () => {
  it('should create registered bird cards', () => {
    const robin = createBirdCard(BirdCardName.AMERICAN_ROBIN);
    expect(robin).not.toBeNull();
    expect(robin!.name).toBe(BirdCardName.AMERICAN_ROBIN);
  });

  it('should return null for placeholder birds', () => {
    const card = createBirdCard(BirdCardName.BIRD_PLACEHOLDER_021);
    expect(card).toBeNull();
  });

  it('should create all registered bird names', () => {
    const names = getRegisteredBirdNames();
    expect(names.length).toBe(20);
    for (const name of names) {
      const card = createBirdCard(name);
      expect(card).not.toBeNull();
      expect(card!.name).toBe(name);
    }
  });

  it('should create all registered bonus cards', () => {
    const names = getRegisteredBonusNames();
    expect(names.length).toBe(26);
    for (const name of names) {
      const card = createBonusCard(name);
      expect(card).not.toBeNull();
      expect(card!.name).toBe(name);
    }
  });
});

describe('Power types coverage', () => {
  it('should have brown power birds', () => {
    const robin = createBirdCard(BirdCardName.AMERICAN_ROBIN);
    expect(robin!.powerType).toBe(PowerType.BROWN);
  });

  it('should have pink power birds', () => {
    const cedar = createBirdCard(BirdCardName.CEDAR_WAXWING);
    expect(cedar!.powerType).toBe(PowerType.PINK);
    expect(cedar!.getTriggeredEvents()).toContain(GameEvent.BIRD_PLAYED);
  });

  it('should have white power birds', () => {
    const cardinal = createBirdCard(BirdCardName.NORTHERN_CARDINAL);
    expect(cardinal!.powerType).toBe(PowerType.WHITE);
  });

  it('should have game-end power birds', () => {
    const dove = createBirdCard(BirdCardName.MOURNING_DOVE);
    expect(dove!.powerType).toBe(PowerType.GAME_END);
  });

  it('should have no-power birds', () => {
    const junco = createBirdCard(BirdCardName.DARK_EYED_JUNCO);
    expect(junco!.powerType).toBe(PowerType.NONE);
  });
});

describe('Game-end scoring powers', () => {
  it('Mourning Dove scores 1 point per seed', () => {
    const dove = new MourningDove();
    const player = new Player('p1' as PlayerId, 'Alice', 8);
    player.addFood(FoodType.SEED);
    player.addFood(FoodType.SEED);
    player.addFood(FoodType.SEED);
    player.addFood(FoodType.FRUIT);
    expect(dove.getGameEndPoints(player)).toBe(3);
  });
});

describe('White powers', () => {
  it('Northern Cardinal gives other players 1 seed', () => {
    const game = new Game('test' as GameId, ['Alice', 'Bob'], 42);
    const alice = game.players[0];
    const bob = game.players[1];
    const bobFoodBefore = bob.food.length;

    const cardinal = new NorthernCardinal();
    cardinal.onPlay(alice, game);

    expect(bob.food.filter(f => f === FoodType.SEED).length)
      .toBeGreaterThan(0);
  });

  it('Red-tailed Hawk draws 2 cards on play', () => {
    const game = new Game('test' as GameId, ['Alice', 'Bob'], 42);
    game.startGame();
    const alice = game.players[0];
    const handBefore = alice.hand.length;

    const hawk = new RedTailedHawk();
    hawk.onPlay(alice, game);

    expect(alice.hand.length).toBe(handBefore + 2);
  });
});

describe('Deck', () => {
  it('should shuffle and draw cards', () => {
    const rng = mulberry32(42);
    const deck = new Deck(['a', 'b', 'c', 'd', 'e'], rng);
    expect(deck.remaining).toBe(5);

    const drawn: string[] = [];
    for (let i = 0; i < 5; i++) {
      drawn.push(deck.draw()!);
    }
    expect(drawn.length).toBe(5);
    expect(deck.remaining).toBe(0);
    expect(deck.draw()).toBeNull();
  });

  it('should reshuffle discard pile when deck empty', () => {
    const rng = mulberry32(42);
    const deck = new Deck<string>(['a', 'b'], rng);
    deck.draw();
    deck.draw();
    expect(deck.remaining).toBe(0);

    deck.discard('x');
    deck.discard('y');
    const card = deck.draw();
    expect(card).not.toBeNull();
    expect(['x', 'y']).toContain(card);
  });

  it('should draw many cards', () => {
    const rng = mulberry32(42);
    const deck = new Deck(['a', 'b', 'c'], rng);
    const drawn = deck.drawMany(2);
    expect(drawn.length).toBe(2);
    expect(deck.remaining).toBe(1);
  });
});

describe('PowerEventBus', () => {
  it('should register and fire events for pink powers', () => {
    const bus = new PowerEventBus();
    const cedar = new CedarWaxwing();
    const owner = new Player('p1' as PlayerId, 'Alice', 8);
    const triggering = new Player('p2' as PlayerId, 'Bob', 8);

    bus.register(GameEvent.BIRD_PLAYED, cedar, owner);

    const game = new Game('test' as GameId, ['Alice', 'Bob'], 42);
    game.players[0] = owner;
    game.players[1] = triggering;
    game.startGame();

    bus.fireEvent(GameEvent.BIRD_PLAYED, triggering, game);
    // DrawCards deferred action should be queued
    expect(game.deferredActions.hasPending).toBe(true);
  });

  it('should not trigger when owner is the triggering player', () => {
    const bus = new PowerEventBus();
    const cedar = new CedarWaxwing();
    const owner = new Player('p1' as PlayerId, 'Alice', 8);

    bus.register(GameEvent.BIRD_PLAYED, cedar, owner);

    const game = new Game('test' as GameId, ['Alice', 'Bob'], 42);
    game.players[0] = owner;

    bus.fireEvent(GameEvent.BIRD_PLAYED, owner, game);
    expect(game.deferredActions.hasPending).toBe(false);
  });

  it('should unregister bird powers', () => {
    const bus = new PowerEventBus();
    const cedar = new CedarWaxwing();
    const owner = new Player('p1' as PlayerId, 'Alice', 8);

    bus.register(GameEvent.BIRD_PLAYED, cedar, owner);
    bus.unregister(cedar);

    const game = new Game('test' as GameId, ['Alice', 'Bob'], 42);
    const triggering = new Player('p2' as PlayerId, 'Bob', 8);

    bus.fireEvent(GameEvent.BIRD_PLAYED, triggering, game);
    expect(game.deferredActions.hasPending).toBe(false);
  });
});

describe('Bonus Cards', () => {
  it('BackyardBirder scores for birds in grassland', () => {
    const card = createBonusCard(BonusCardName.BACKYARD_BIRDER);
    const player = new Player('p1' as PlayerId, 'Alice', 8);
    player.board.placeBird(HabitatType.GRASSLAND, { name: 'bird1', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    player.board.placeBird(HabitatType.GRASSLAND, { name: 'bird2', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    player.board.placeBird(HabitatType.FOREST, { name: 'bird3', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    expect(card!.score(player)).toBe(2);
  });

  it('BreedingManager scores for birds with eggs', () => {
    const card = createBonusCard(BonusCardName.BREEDING_MANAGER);
    const player = new Player('p1' as PlayerId, 'Alice', 8);
    player.board.placeBird(HabitatType.FOREST, { name: 'bird1', eggs: 2, cachedFood: 0, tuckedCards: 0 });
    player.board.placeBird(HabitatType.FOREST, { name: 'bird2', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    player.board.placeBird(HabitatType.GRASSLAND, { name: 'bird3', eggs: 1, cachedFood: 0, tuckedCards: 0 });
    expect(card!.score(player)).toBe(2);
  });

  it('Cartographer scores 3 if all habitats have birds', () => {
    const card = createBonusCard(BonusCardName.CARTOGRAPHER);
    const player = new Player('p1' as PlayerId, 'Alice', 8);
    player.board.placeBird(HabitatType.FOREST, { name: 'b1', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    player.board.placeBird(HabitatType.GRASSLAND, { name: 'b2', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    expect(card!.score(player)).toBe(0);
    player.board.placeBird(HabitatType.WETLAND, { name: 'b3', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    expect(card!.score(player)).toBe(3);
  });

  it('BirdCounter scores 1 per total bird', () => {
    const card = createBonusCard(BonusCardName.BIRD_COUNTER);
    const player = new Player('p1' as PlayerId, 'Alice', 8);
    player.board.placeBird(HabitatType.FOREST, { name: 'b1', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    player.board.placeBird(HabitatType.WETLAND, { name: 'b2', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    expect(card!.score(player)).toBe(2);
  });

  it('EnclosureBuilder scores for birds with cached food', () => {
    const card = createBonusCard(BonusCardName.ENCLOSURE_BUILDER);
    const player = new Player('p1' as PlayerId, 'Alice', 8);
    player.board.placeBird(HabitatType.FOREST, { name: 'b1', eggs: 0, cachedFood: 2, tuckedCards: 0 });
    player.board.placeBird(HabitatType.FOREST, { name: 'b2', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    expect(card!.score(player)).toBe(2);
  });

  it('PrairieManager scores eggs in grassland', () => {
    const card = createBonusCard(BonusCardName.PRAIRIE_MANAGER);
    const player = new Player('p1' as PlayerId, 'Alice', 8);
    player.board.placeBird(HabitatType.GRASSLAND, { name: 'b1', eggs: 3, cachedFood: 0, tuckedCards: 0 });
    player.board.placeBird(HabitatType.GRASSLAND, { name: 'b2', eggs: 2, cachedFood: 0, tuckedCards: 0 });
    player.board.placeBird(HabitatType.FOREST, { name: 'b3', eggs: 5, cachedFood: 0, tuckedCards: 0 });
    expect(card!.score(player)).toBe(5);
  });
});

describe('GoalRegistry', () => {
  it('should select 4 random goals', () => {
    const rng = mulberry32(42);
    const goals = selectGoalTiles(rng);
    expect(goals.length).toBe(4);
    // All should be unique
    const ids = goals.map(g => g.id);
    expect(new Set(ids).size).toBe(4);
  });

  it('should score round goals for 2 players', () => {
    const goal = ALL_GOAL_TILES.find(g => g.id === 'birds_in_forest')!;
    const p1 = new Player('p1' as PlayerId, 'Alice', 8);
    const p2 = new Player('p2' as PlayerId, 'Bob', 8);

    p1.board.placeBird(HabitatType.FOREST, { name: 'b1', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    p1.board.placeBird(HabitatType.FOREST, { name: 'b2', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    p2.board.placeBird(HabitatType.FOREST, { name: 'b3', eggs: 0, cachedFood: 0, tuckedCards: 0 });

    const scores = scoreRoundGoal(goal, [p1, p2]);
    expect(scores.get(p1)).toBe(4); // 1st place
    expect(scores.get(p2)).toBe(1); // 2nd place
  });

  it('should handle ties in goal scoring', () => {
    const goal = ALL_GOAL_TILES.find(g => g.id === 'birds_in_forest')!;
    const p1 = new Player('p1' as PlayerId, 'Alice', 8);
    const p2 = new Player('p2' as PlayerId, 'Bob', 8);

    p1.board.placeBird(HabitatType.FOREST, { name: 'b1', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    p2.board.placeBird(HabitatType.FOREST, { name: 'b2', eggs: 0, cachedFood: 0, tuckedCards: 0 });

    const scores = scoreRoundGoal(goal, [p1, p2]);
    // Tied for 1st: (4+1)/2 = 2 each
    expect(scores.get(p1)).toBe(scores.get(p2));
    expect(scores.get(p1)).toBe(2);
  });

  it('should award 0 points for 0 value', () => {
    const goal = ALL_GOAL_TILES.find(g => g.id === 'eggs_in_wetland')!;
    const p1 = new Player('p1' as PlayerId, 'Alice', 8);
    const p2 = new Player('p2' as PlayerId, 'Bob', 8);

    const scores = scoreRoundGoal(goal, [p1, p2]);
    expect(scores.get(p1)).toBe(0);
    expect(scores.get(p2)).toBe(0);
  });
});
