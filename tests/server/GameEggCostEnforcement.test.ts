import { Game } from '../../src/server/Game';
import { GameId } from '../../src/common/Types';
import { BirdCardName } from '../../src/common/cards/BirdCardName';
import { HabitatType } from '../../src/common/game/HabitatType';
import { FoodType } from '../../src/common/game/FoodType';
import { InputType } from '../../src/common/input/InputType';

describe('Game egg-cost enforcement for bird placement', () => {
  it('excludes habitats that require eggs the player cannot pay', () => {
    const game = new Game('egg_cost_1' as GameId, ['Alice', 'Bob'], 42);
    const alice = game.players[0];

    // Forest next slot is index 2 -> egg cost 1, but Alice has no eggs on board.
    alice.board.placeBird(HabitatType.FOREST, { name: 'f1', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    alice.board.placeBird(HabitatType.FOREST, { name: 'f2', eggs: 0, cachedFood: 0, tuckedCards: 0 });

    alice.addCardToHand(BirdCardName.AMERICAN_ROBIN); // FOREST/GRASSLAND
    alice.addFood(FoodType.INVERTEBRATE);
    alice.addFood(FoodType.FRUIT);

    const input = game.handleBirdSelection(alice.id, BirdCardName.AMERICAN_ROBIN) as any;
    expect(input.type).toBe(InputType.SELECT_HABITAT_SLOT);
    expect(input.availableHabitats).toContain(HabitatType.GRASSLAND);
    expect(input.availableHabitats).not.toContain(HabitatType.FOREST);
  });

  it('prevents direct placement into unaffordable egg-cost slots', () => {
    const game = new Game('egg_cost_2' as GameId, ['Alice', 'Bob'], 42);
    const alice = game.players[0];

    alice.board.placeBird(HabitatType.WETLAND, { name: 'w1', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    alice.board.placeBird(HabitatType.WETLAND, { name: 'w2', eggs: 0, cachedFood: 0, tuckedCards: 0 });
    // No eggs available to pay cost 1 for slot index 2.

    alice.addCardToHand(BirdCardName.ATLANTIC_PUFFIN);

    expect(() => {
      game.playBirdFromHand(alice, BirdCardName.ATLANTIC_PUFFIN, HabitatType.WETLAND);
    }).toThrow('Insufficient eggs');
  });
});

