import { FoodType } from '../../../src/common/game/FoodType';
import { InputType } from '../../../src/common/input/InputType';
import { PayBirdCost, canAffordBirdFoodCost } from '../../../src/server/deferredActions/PayBirdCost';
import { createTestPlayer, giveFood } from '../helpers/TestPlayer';

describe('PayBirdCost', () => {
  it('checks affordability with 2-for-1 exchange for specific symbols', () => {
    expect(canAffordBirdFoodCost([FoodType.SEED, FoodType.FRUIT], [FoodType.FISH])).toBe(true);
    expect(canAffordBirdFoodCost([FoodType.SEED], [FoodType.FISH])).toBe(false);
  });

  it('only offers viable payment methods (no dead-end exchange)', () => {
    const player = createTestPlayer('Alice');
    giveFood(player, [FoodType.FISH, FoodType.SEED, FoodType.RODENT]);

    const action = new PayBirdCost(player, [FoodType.FISH, FoodType.FISH]);
    const prompt = action.execute({} as any);

    expect(prompt?.type).toBe(InputType.SELECT_FOOD);
    expect((prompt as any).min).toBe(3);
    expect((prompt as any).max).toBe(3);
  });

  it('lets player choose exchange and spend two selected foods', () => {
    const player = createTestPlayer('Alice');
    giveFood(player, [FoodType.SEED, FoodType.FRUIT]);

    const action = new PayBirdCost(player, [FoodType.FISH]);
    const first = action.execute({} as any);
    expect(first?.type).toBe(InputType.SELECT_FOOD);
    expect((first as any).min).toBe(2);
    expect((first as any).max).toBe(2);

    const done = action.handleInput?.({} as any, { selectedFood: [FoodType.SEED, FoodType.FRUIT] });
    expect(done).toBeUndefined();
    expect(player.food).toEqual([]);
  });
});
