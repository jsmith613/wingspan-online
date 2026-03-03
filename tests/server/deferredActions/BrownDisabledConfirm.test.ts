import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { HabitatType } from '../../../src/common/game/HabitatType';
import { BirdCardName } from '../../../src/common/cards/BirdCardName';
import { FoodType } from '../../../src/common/game/FoodType';
import { ConfirmSimpleBrownEffect } from '../../../src/server/deferredActions/ConfirmSimpleBrownEffect';
import { DiscardEggForWildFood } from '../../../src/server/deferredActions/DiscardEggForWildFood';
import { PayFoodToTuckFromDeck } from '../../../src/server/deferredActions/PayFoodToTuckFromDeck';
import { GainFromBirdfeederChoices } from '../../../src/server/deferredActions/GainFromBirdfeederChoices';
import { Birdfeeder } from '../../../src/server/birdfeeder/Birdfeeder';
import { mulberry32 } from '../../../src/common/prng';

describe('Brown confirm disabled states', () => {
  it('disables confirm when simple effect cannot be fulfilled', () => {
    const game = new Game('disabled_simple_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    const action = new ConfirmSimpleBrownEffect(
      player,
      'Lay 1 egg on this bird.',
      () => {},
      false,
      'No space for more eggs on this bird',
    );
    const input = action.execute(game) as any;
    expect(input.disabledOptions).toContain('CONFIRM_BROWN_EFFECT');
  });

  it('disables confirm when no eggs to discard', () => {
    const game = new Game('disabled_egg_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    const action = new DiscardEggForWildFood(
      player,
      1,
      'Discard 1 egg from any of your other birds to gain 1 wild from the supply.',
    );
    const input = action.execute(game) as any;
    expect(input.disabledOptions).toContain('CONFIRM_DISCARD_EGG_GAIN_WILD');
  });

  it('disables confirm when missing required food payment', () => {
    const game = new Game('disabled_pay_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    player.board.placeBird(HabitatType.WETLAND, {
      name: BirdCardName.AMERICAN_WHITE_PELICAN,
      eggs: 0,
      cachedFood: 0,
      tuckedCards: 0,
    });
    const bird = player.board.getAllBirds()[0];
    const action = new PayFoodToTuckFromDeck(
      player,
      bird,
      FoodType.FISH,
      2,
      'Discard 1 fish to tuck 2 card from the deck behind this bird.',
    );
    const input = action.execute(game) as any;
    expect(input.disabledOptions).toContain('CONFIRM_PAY_TUCK');
  });

  it('disables confirm when birdfeeder has no allowed foods', () => {
    const game = new Game('disabled_feeder_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    game.birdfeeder = Birdfeeder.deserialize(
      {
        dice: [
          { foods: [FoodType.FISH], taken: false },
          { foods: [FoodType.FISH], taken: false },
          { foods: [FoodType.FISH], taken: false },
          { foods: [FoodType.FISH], taken: false },
          { foods: [FoodType.FISH], taken: false },
        ],
      },
      mulberry32(99),
    );
    const action = new GainFromBirdfeederChoices(
      player,
      [FoodType.SEED, FoodType.FRUIT],
      'Gain 1 seed or fruit from the birdfeeder, if available.',
    );
    const input = action.execute(game) as any;
    expect(input.disabledOptions).toContain('CONFIRM_GAIN_BIRDFEEDER');
  });
});
