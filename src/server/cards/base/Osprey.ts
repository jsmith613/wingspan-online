import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { AllPlayersGainFoodFromSupply } from '../../deferredActions/AllPlayersGainFoodFromSupply';

export class Osprey extends BirdCard {
  readonly name = BirdCardName.OSPREY;
  readonly commonName = 'Osprey';
  readonly scientificName = 'Pandion haliaetus';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 160;
  readonly points = 5;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players gain 1 fish from the supply.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new AllPlayersGainFoodFromSupply(player, FoodType.FISH, this.powerText));
  }
}
