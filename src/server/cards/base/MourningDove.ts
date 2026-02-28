import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';

/**
 * Mourning Dove - Game-end power: 1 point per seed in your supply.
 * Habitats: Grassland. Nest: Bowl. Eggs: 2. Wingspan: 45cm. Points: 1.
 * Food: Seed.
 */
export class MourningDove extends BirdCard {
  readonly name = BirdCardName.MOURNING_DOVE;
  readonly commonName = 'Mourning Dove';
  readonly scientificName = 'Zenaida macroura';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.SEED];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 45;
  readonly points = 1;
  readonly powerType = PowerType.GAME_END;
  readonly powerText = 'Game End: 1 point for each seed in your supply.';

  getGameEndPoints(player: Player): number {
    return player.getFoodCount(FoodType.SEED);
  }
}
