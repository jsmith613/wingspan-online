import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { AllPlayersGainFoodFromSupply } from '../../deferredActions/AllPlayersGainFoodFromSupply';

export class RedCrossbill extends BirdCard {
  readonly name = BirdCardName.RED_CROSSBILL;
  readonly commonName = 'Red Crossbill';
  readonly scientificName = 'Loxia curvirostra';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.SEED, FoodType.SEED];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 28;
  readonly points = 6;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players gain 1 seed from the supply.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new AllPlayersGainFoodFromSupply(player, FoodType.SEED, this.powerText));
  }
}
