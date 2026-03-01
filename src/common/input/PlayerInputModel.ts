import { InputType } from './InputType';
import { ActionType } from '../game/ActionType';
import { FoodType } from '../game/FoodType';
import { HabitatType } from '../game/HabitatType';
import { BirdCardName } from '../cards/BirdCardName';
import { BonusCardName } from '../cards/BonusCardName';
import { ClientBirdCard } from '../cards/ClientBirdCard';

export interface SelectActionInput {
  readonly type: InputType.SELECT_ACTION;
  readonly availableActions: ReadonlyArray<ActionType>;
}

export interface SelectBirdInput {
  readonly type: InputType.SELECT_BIRD;
  readonly availableBirds: ReadonlyArray<BirdCardName>;
  readonly birdDetails?: ReadonlyArray<ClientBirdCard>;
  readonly unaffordableBirds?: ReadonlyArray<BirdCardName>;
  readonly lockBack?: boolean;
  readonly min: number;
  readonly max: number;
}

export interface SelectFoodDie {
  readonly foods: ReadonlyArray<FoodType>;
}

export interface SelectFoodInput {
  readonly type: InputType.SELECT_FOOD;
  readonly availableDice: ReadonlyArray<SelectFoodDie>;
  readonly message?: string;
  readonly requiredCost?: ReadonlyArray<FoodType>;
  readonly canReroll?: boolean;
  readonly lockBack?: boolean;
  readonly min: number;
  readonly max: number;
}

export interface SelectHabitatSlotInput {
  readonly type: InputType.SELECT_HABITAT_SLOT;
  readonly availableHabitats: ReadonlyArray<HabitatType>;
  readonly lockBack?: boolean;
}

export interface SelectEggLocationInput {
  readonly type: InputType.SELECT_EGG_LOCATION;
  readonly availableBirds: ReadonlyArray<BirdCardName>;
  readonly eggsToLay: number;
}

export interface SelectCardsInput {
  readonly type: InputType.SELECT_CARDS;
  readonly availableCards: ReadonlyArray<BirdCardName>;
  readonly min: number;
  readonly max: number;
}

export interface SelectOptionInput {
  readonly type: InputType.SELECT_OPTION;
  readonly options: ReadonlyArray<string>;
  readonly message: string;
  readonly cardDetails?: ReadonlyArray<ClientBirdCard>;
}

export interface OrOptionsInput {
  readonly type: InputType.OR_OPTIONS;
  readonly options: ReadonlyArray<PlayerInputModel>;
}

export interface SelectBirdToKeepInput {
  readonly type: InputType.SELECT_BIRD_TO_KEEP;
  readonly birds: ReadonlyArray<BirdCardName>;
  readonly birdDetails?: ReadonlyArray<ClientBirdCard>;
  readonly max: number;
}

export interface SelectBonusCardInput {
  readonly type: InputType.SELECT_BONUS_CARD;
  readonly availableBonusCards: ReadonlyArray<BonusCardName>;
  readonly min: number;
  readonly max: number;
}

export interface SelectStartingFoodInput {
  readonly type: InputType.SELECT_STARTING_FOOD;
  readonly availableFood: ReadonlyArray<FoodType>;
  readonly count: number;
}

export type PlayerInputModel =
  | SelectActionInput
  | SelectBirdInput
  | SelectFoodInput
  | SelectHabitatSlotInput
  | SelectEggLocationInput
  | SelectCardsInput
  | SelectOptionInput
  | OrOptionsInput
  | SelectBirdToKeepInput
  | SelectBonusCardInput
  | SelectStartingFoodInput;
