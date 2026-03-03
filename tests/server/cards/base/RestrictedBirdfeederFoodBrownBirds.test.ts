import { Game } from '../../../../src/server/Game';
import { Birdfeeder } from '../../../../src/server/birdfeeder/Birdfeeder';
import { BirdCardName } from '../../../../src/common/cards/BirdCardName';
import { FoodType } from '../../../../src/common/game/FoodType';
import { InputType } from '../../../../src/common/input/InputType';
import { GameId } from '../../../../src/common/Types';
import { mulberry32 } from '../../../../src/common/prng';

const CASES: Array<{ bird: BirdCardName; allowed: FoodType[] }> = [
  { bird: BirdCardName.ACORN_WOODPECKER, allowed: [FoodType.SEED] },
  { bird: BirdCardName.BLUE_JAY, allowed: [FoodType.SEED] },
  { bird: BirdCardName.CLARKS_NUTCRACKER, allowed: [FoodType.SEED] },
  { bird: BirdCardName.RED_BELLIED_WOODPECKER, allowed: [FoodType.SEED] },
  { bird: BirdCardName.RED_HEADED_WOODPECKER, allowed: [FoodType.SEED] },
  { bird: BirdCardName.STELLERS_JAY, allowed: [FoodType.SEED] },
  { bird: BirdCardName.GREAT_CRESTED_FLYCATCHER, allowed: [FoodType.INVERTEBRATE] },
  { bird: BirdCardName.INDIGO_BUNTING, allowed: [FoodType.INVERTEBRATE, FoodType.FRUIT] },
  { bird: BirdCardName.WESTERN_TANAGER, allowed: [FoodType.INVERTEBRATE, FoodType.FRUIT] },
  { bird: BirdCardName.ROSE_BREASTED_GROSBEAK, allowed: [FoodType.SEED, FoodType.FRUIT] },
];

describe('Restricted birdfeeder gain brown birds', () => {
  it.each(CASES)('limits selectable foods and shows bird-power prompt for $bird', ({ bird, allowed }) => {
    const game = new Game(`restricted_food_${bird}` as GameId, ['Alice'], 42);
    const player = game.players[0];
    const card = game.createBirdCardInstance(bird)!;

    game.birdfeeder = Birdfeeder.deserialize(
      {
        dice: [
          { foods: [FoodType.SEED], taken: false },
          { foods: [FoodType.INVERTEBRATE], taken: false },
          { foods: [FoodType.FRUIT], taken: false },
          { foods: [FoodType.FISH], taken: false },
          { foods: [FoodType.RODENT], taken: false },
        ],
      },
      mulberry32(99),
    );

    card.onActivate(player, game);
    let input = game.deferredActions.runUntilInput(game) as any;

    if (input.type === InputType.SELECT_OPTION) {
      expect(input.message).toContain(card.commonName);
      input = game.deferredActions.handleInput(game, { selectedOption: 'CONFIRM_GAIN_BIRDFEEDER' }) as any;
    }

    expect(input.type).toBe(InputType.SELECT_FOOD);
    expect(input.message).toContain(card.commonName);

    const flattened = (input.availableDice as Array<{ foods: FoodType[] }>)
      .flatMap((d) => d.foods);
    expect(flattened.length).toBeGreaterThan(0);
    expect(flattened.every((f) => allowed.includes(f))).toBe(true);
  });
});

