import { FoodType } from '../../common/game/FoodType';

/**
 * Represents one face of a birdfeeder die.
 * Most faces offer a single food; one face offers a choice of two.
 */
export interface DieFace {
  readonly foods: ReadonlyArray<FoodType>;
}

/**
 * The 6 faces of a standard birdfeeder die:
 *   Invertebrate/Seed (choice), Seed, Rodent, Invertebrate, Fish, Fruit
 */
export const STANDARD_DIE_FACES: ReadonlyArray<DieFace> = [
  { foods: [FoodType.INVERTEBRATE, FoodType.SEED] }, // choice face
  { foods: [FoodType.SEED] },
  { foods: [FoodType.RODENT] },
  { foods: [FoodType.INVERTEBRATE] },
  { foods: [FoodType.FISH] },
  { foods: [FoodType.FRUIT] },
];
