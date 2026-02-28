import { Game } from '../../src/server/Game';
import { GameId } from '../../src/common/Types';
import { BirdCardName } from '../../src/common/cards/BirdCardName';
import { HabitatType } from '../../src/common/game/HabitatType';
import { InputType } from '../../src/common/input/InputType';
import { createBirdCard } from '../../src/server/cards/createCard';
import { GameEvent } from '../../src/server/powers/PowerEventBus';
import { FoodType } from '../../src/common/game/FoodType';

describe('Game deferred input ownership', () => {
  it('targets waiting input to non-active player when pink power requires it', () => {
    const game = new Game('ownership_1' as GameId, ['Alice', 'Bob'], 42);
    const alice = game.players[0];
    const bob = game.players[1];

    // Bob owns Cedar Waxwing (pink draw cards on another player's bird play).
    bob.board.placeBird(HabitatType.FOREST, {
      name: BirdCardName.CEDAR_WAXWING,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    game.rebuildPowerListeners();

    // Let Alice play a bird to trigger Bob's pink power.
    alice.addCardToHand(BirdCardName.AMERICAN_ROBIN);
    alice.addFood(FoodType.INVERTEBRATE);
    alice.addFood(FoodType.FRUIT);
    const robin = createBirdCard(BirdCardName.AMERICAN_ROBIN);

    const input = (game as any).placeBirdInHabitat(
      alice,
      BirdCardName.AMERICAN_ROBIN,
      HabitatType.FOREST,
      robin
    ) as any;

    expect(input.type).toBe(InputType.SELECT_OPTION);
    expect(game.getExpectedInputPlayerId()).toBe(bob.id);
  });

  it('rejects deferred input from the wrong player', () => {
    const game = new Game('ownership_2' as GameId, ['Alice', 'Bob'], 42);
    const alice = game.players[0];
    const bob = game.players[1];

    bob.board.placeBird(HabitatType.FOREST, {
      name: BirdCardName.CEDAR_WAXWING,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    game.rebuildPowerListeners();
    game.powerEventBus.startNewTurn();
    game.fireGameEvent(GameEvent.BIRD_PLAYED, alice);
    const waiting = game.deferredActions.runUntilInput(game) as any;
    expect(waiting.type).toBe(InputType.SELECT_OPTION);

    expect(() => {
      game.handleDeferredInput(alice.id, { selectedOption: 'DRAW_FROM_DECK' });
    }).toThrow('wrong player');
  });
});
