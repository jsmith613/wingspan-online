import { InputType } from '../../common/input/InputType';
import { SelectFoodInput } from '../../common/input/PlayerInputModel';
import { FoodType } from '../../common/game/FoodType';

export function createSelectFoodInput(
  availableFood: FoodType[],
  min: number = 1,
  max: number = 1
): SelectFoodInput {
  return {
    type: InputType.SELECT_FOOD,
    availableDice: availableFood.map(f => ({ foods: [f] })),
    min,
    max,
  };
}
