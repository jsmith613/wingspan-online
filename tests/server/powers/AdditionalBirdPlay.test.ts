import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { BirdCardName } from '../../../src/common/cards/BirdCardName';
import { HabitatType } from '../../../src/common/game/HabitatType';
import { FoodType } from '../../../src/common/game/FoodType';
import { InputType } from '../../../src/common/input/InputType';
import { createBirdCard } from '../../../src/server/cards/createCard';

describe('Additional bird white powers', () => {
  it('prompts and plays an additional bird for Downy Woodpecker', () => {
    const game = new Game('additional_bird_1' as GameId, ['Alice', 'Bob'], 42);
    const alice = game.players[0];

    alice.addCardToHand(BirdCardName.DOWNY_WOODPECKER);
    alice.addCardToHand(BirdCardName.RED_EYED_VIREO);

    // Food for Downy (invertebrate, seed, fruit) + Vireo (invertebrate, fruit).
    alice.addFood(FoodType.INVERTEBRATE);
    alice.addFood(FoodType.SEED);
    alice.addFood(FoodType.FRUIT);
    alice.addFood(FoodType.INVERTEBRATE);
    alice.addFood(FoodType.FRUIT);

    const downy = createBirdCard(BirdCardName.DOWNY_WOODPECKER);
    const prompt = (game as any).placeBirdInHabitat(
      alice,
      BirdCardName.DOWNY_WOODPECKER,
      HabitatType.FOREST,
      downy,
    ) as any;

    expect(prompt.type).toBe(InputType.SELECT_BIRD);
    expect(prompt.availableBirds).toContain(BirdCardName.RED_EYED_VIREO);
    expect(game.getExpectedInputPlayerId()).toBe(alice.id);

    game.handleDeferredInput(alice.id, {
      selectedBirds: [BirdCardName.RED_EYED_VIREO],
    });
    game.handleDeferredInput(alice.id, { selectedFood: [FoodType.INVERTEBRATE, FoodType.FRUIT] });

    const forestBirds = alice.board.getBirdsInHabitat(HabitatType.FOREST);
    expect(forestBirds.map(b => b.name)).toEqual(
      expect.arrayContaining([BirdCardName.DOWNY_WOODPECKER, BirdCardName.RED_EYED_VIREO]),
    );
  });

  it('locks additional House Wren play to the habitat it was played in', () => {
    const game = new Game('additional_bird_2' as GameId, ['Alice', 'Bob'], 42);
    const alice = game.players[0];

    alice.addCardToHand(BirdCardName.HOUSE_WREN);
    alice.addCardToHand(BirdCardName.SAVANNAH_SPARROW);

    // Food for House Wren + Savannah Sparrow
    alice.addFood(FoodType.INVERTEBRATE);
    alice.addFood(FoodType.INVERTEBRATE);
    alice.addFood(FoodType.SEED);
    alice.addFood(FoodType.FRUIT);

    const houseWren = createBirdCard(BirdCardName.HOUSE_WREN);
    const prompt = (game as any).placeBirdInHabitat(
      alice,
      BirdCardName.HOUSE_WREN,
      HabitatType.GRASSLAND,
      houseWren,
    ) as any;

    expect(prompt.type).toBe(InputType.SELECT_BIRD);
    expect(prompt.availableBirds).toContain(BirdCardName.SAVANNAH_SPARROW);

    game.handleDeferredInput(alice.id, {
      selectedBirds: [BirdCardName.SAVANNAH_SPARROW],
    });
    game.handleDeferredInput(alice.id, { selectedFood: [FoodType.INVERTEBRATE, FoodType.SEED] });

    const grasslandBirds = alice.board.getBirdsInHabitat(HabitatType.GRASSLAND);
    expect(grasslandBirds.map(b => b.name)).toEqual(
      expect.arrayContaining([BirdCardName.HOUSE_WREN, BirdCardName.SAVANNAH_SPARROW]),
    );
    expect(alice.board.getBirdCount(HabitatType.FOREST)).toBe(0);
  });
});
