import { FoodType } from './game/FoodType';

export interface FoodCost {
  readonly foods: ReadonlyArray<FoodType>;
  readonly totalRequired: number;
  readonly wildCount: number;
}
