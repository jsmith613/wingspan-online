import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';

/**
 * Osprey - Game-end power: 2 points per fish in your supply.
 * Habitats: Wetland. Nest: Platform. Eggs: 2. Wingspan: 163cm. Points: 5.
 * Food: Fish, Fish, Fish.
 */
export class Osprey extends BirdCard {
  readonly name = BirdCardName.OSPREY;
  readonly commonName = 'Osprey';
  readonly scientificName = 'Pandion haliaetus';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.FISH, FoodType.FISH];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 163;
  readonly points = 5;
  readonly powerType = PowerType.GAME_END;
  readonly powerText = 'Game End: 2 points for each fish in your supply.';

  getGameEndPoints(player: Player): number {
    return player.getFoodCount(FoodType.FISH) * 2;
  }
}
