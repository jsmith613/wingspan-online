import { BirdCardName } from './BirdCardName';
import { FoodType } from '../game/FoodType';
import { NestType } from '../game/NestType';
import { HabitatType } from '../game/HabitatType';
import { PowerType } from '../game/PowerType';

export interface ClientBirdCard {
  readonly name: BirdCardName;
  readonly commonName: string;
  readonly scientificName: string;
  readonly habitats: ReadonlyArray<HabitatType>;
  readonly foodCost: ReadonlyArray<FoodType>;
  readonly nestType: NestType;
  readonly eggCapacity: number;
  readonly wingspan: number;
  readonly points: number;
  readonly powerType: PowerType;
  readonly powerText: string;

  // Mutable state when placed on board
  eggs: number;
  cachedFood: number;
  tuckedCards: number;
}
