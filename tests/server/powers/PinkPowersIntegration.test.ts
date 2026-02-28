import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { BirdCardName } from '../../../src/common/cards/BirdCardName';
import { HabitatType } from '../../../src/common/game/HabitatType';
import { GameEvent } from '../../../src/server/powers/PowerEventBus';
import { InputType } from '../../../src/common/input/InputType';
import { GainFood } from '../../../src/server/deferredActions/GainFood';
import { createBirdCard } from '../../../src/server/cards/createCard';
import { FoodType } from '../../../src/common/game/FoodType';

describe('Pink power integration', () => {
  it('triggers FOOD_GAINED pink powers during gain-food flow', () => {
    const game = new Game('pink_food_1' as GameId, ['Alice', 'Bob'], 42);
    const alice = game.players[0];
    const bob = game.players[1];

    // Bob owns Eastern Phoebe (pink: when another player gains food, lay 1 egg).
    bob.board.placeBird(HabitatType.FOREST, {
      name: BirdCardName.EASTERN_PHOEBE,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    game.rebuildPowerListeners();

    // Simulate a gain-food deferred action for Alice.
    game.deferredActions.push(new GainFood(alice, 1));
    const selectFood = game.deferredActions.runUntilInput(game) as any;
    expect(selectFood.type).toBe(InputType.SELECT_FOOD);

    const firstFood = selectFood.availableDice[0].foods[0];
    game.deferredActions.handleInput(game, { selectedFood: [firstFood] });

    // Pink power from Bob should now be queued and ask for egg placement.
    const pinkInput = game.deferredActions.runUntilInput(game) as any;
    expect(pinkInput.type).toBe(InputType.SELECT_EGG_LOCATION);
    expect(pinkInput.eggsToLay).toBe(1);
  });

  it('triggers BIRD_PLAYED pink powers only once per turn', () => {
    const game = new Game('pink_bird_1' as GameId, ['Alice', 'Bob'], 42);
    const alice = game.players[0];
    const bob = game.players[1];

    // Bob owns Cedar Waxwing (pink: when another player plays a bird, draw 1 card).
    bob.board.placeBird(HabitatType.FOREST, {
      name: BirdCardName.CEDAR_WAXWING,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    game.rebuildPowerListeners();

    game.powerEventBus.startNewTurn();
    game.fireGameEvent(GameEvent.BIRD_PLAYED, alice);
    game.fireGameEvent(GameEvent.BIRD_PLAYED, alice);

    // Only one pink trigger should be queued this turn.
    expect(game.deferredActions.length).toBe(1);

    // New turn resets once-between-turn lock.
    game.deferredActions.clear();
    game.powerEventBus.startNewTurn();
    game.fireGameEvent(GameEvent.BIRD_PLAYED, alice);
    expect(game.deferredActions.length).toBe(1);
  });

  it('resolves when-played draw before pink between-turn prompt', () => {
    const game = new Game('pink_bird_2' as GameId, ['Alice', 'Bob'], 42);
    const alice = game.players[0];
    const bob = game.players[1];

    // Alice owns Cedar Waxwing.
    alice.board.placeBird(HabitatType.FOREST, {
      name: BirdCardName.CEDAR_WAXWING,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    game.rebuildPowerListeners();

    // Bob plays Red-tailed Hawk (when played: draw 2 cards).
    bob.addCardToHand(BirdCardName.RED_TAILED_HAWK);
    bob.addFood(FoodType.RODENT);
    bob.addFood(FoodType.RODENT);
    const handBefore = bob.hand.length;

    const hawk = createBirdCard(BirdCardName.RED_TAILED_HAWK);
    const pinkInput = (game as any).placeBirdInHabitat(
      bob,
      BirdCardName.RED_TAILED_HAWK,
      HabitatType.FOREST,
      hawk
    ) as any;

    // Bob spent 1 card to play, then drew 2 from the hawk.
    expect(bob.hand.length).toBe(handBefore + 1);
    expect(pinkInput.type).toBe(InputType.SELECT_OPTION);
    expect(game.getExpectedInputPlayerId()).toBe(alice.id);
  });
});
