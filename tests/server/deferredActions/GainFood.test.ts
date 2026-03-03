import { GainFood } from '../../../src/server/deferredActions/GainFood';
import { Game } from '../../../src/server/Game';
import { GameId } from '../../../src/common/Types';
import { InputType } from '../../../src/common/input/InputType';
import { Birdfeeder } from '../../../src/server/birdfeeder/Birdfeeder';
import { FoodType } from '../../../src/common/game/FoodType';
import { mulberry32 } from '../../../src/common/prng';

describe('GainFood reroll flow', () => {
  it('allows reroll input only within gain-food flow and keeps action active', () => {
    const game = new Game('test_gain_food_1' as GameId, ['Alice'], 42);
    const player = game.players[0];
    const action = new GainFood(player, 1);

    game.birdfeeder = Birdfeeder.deserialize(
      {
        dice: [
          { foods: [FoodType.SEED], taken: false },
          { foods: [FoodType.SEED], taken: false },
          { foods: [FoodType.SEED], taken: false },
          { foods: [FoodType.SEED], taken: false },
          { foods: [FoodType.SEED], taken: false },
        ],
      },
      mulberry32(99)
    );

    const beforeFoodCount = player.food.length;
    const firstInput = action.execute(game) as any;
    expect(firstInput.type).toBe(InputType.SELECT_FOOD);
    expect(firstInput.canReroll).toBe(true);
    expect(firstInput.lockBack).toBe(false);
    expect(action.isCancellationLocked()).toBe(false);

    const nextInput = action.handleInput(game, { rerollBirdfeeder: true }) as any;
    expect(nextInput.type).toBe(InputType.SELECT_FOOD);
    expect(nextInput.lockBack).toBe(true);
    expect(action.isCancellationLocked()).toBe(true);
    expect(player.food.length).toBe(beforeFoodCount);
  });

  it('supports restricting selectable foods and custom prompt message', () => {
    const game = new Game('test_gain_food_2' as GameId, ['Alice'], 42);
    const player = game.players[0];
    const action = new GainFood(player, 1, {
      allowedFoods: [FoodType.SEED],
      message: 'Red-Bellied Woodpecker: Gain 1 seed from the birdfeeder.',
    });

    game.birdfeeder = Birdfeeder.deserialize(
      {
        dice: [
          { foods: [FoodType.SEED], taken: false },
          { foods: [FoodType.FRUIT], taken: false },
          { foods: [FoodType.SEED, FoodType.INVERTEBRATE], taken: false },
          { foods: [FoodType.FISH, FoodType.RODENT], taken: false },
          { foods: [FoodType.SEED], taken: false },
        ],
      },
      mulberry32(99)
    );

    const input = action.execute(game) as any;
    expect(input.type).toBe(InputType.SELECT_FOOD);
    expect(input.message).toBe('Red-Bellied Woodpecker: Gain 1 seed from the birdfeeder.');
    expect(input.availableDice).toEqual([
      { foods: [FoodType.SEED] },
      { foods: [FoodType.SEED] },
      { foods: [FoodType.SEED] },
    ]);
  });

  it('ignores disallowed food selections when foods are restricted', () => {
    const game = new Game('test_gain_food_3' as GameId, ['Alice'], 42);
    const player = game.players[0];
    const action = new GainFood(player, 1, {
      allowedFoods: [FoodType.SEED],
      message: 'Red-Bellied Woodpecker: Gain 1 seed from the birdfeeder.',
    });

    game.birdfeeder = Birdfeeder.deserialize(
      {
        dice: [
          { foods: [FoodType.SEED], taken: false },
          { foods: [FoodType.FRUIT], taken: false },
          { foods: [FoodType.SEED], taken: false },
          { foods: [FoodType.FISH], taken: false },
          { foods: [FoodType.RODENT], taken: false },
        ],
      },
      mulberry32(99)
    );

    const beforeFoodCount = player.food.length;
    const nextInput = action.handleInput(game, { selectedFood: [FoodType.FRUIT] }) as any;
    expect(nextInput.type).toBe(InputType.SELECT_FOOD);
    expect(player.food.length).toBe(beforeFoodCount);
  });
});
