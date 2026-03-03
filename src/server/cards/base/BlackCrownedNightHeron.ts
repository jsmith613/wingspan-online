import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DiscardEggForWildFood } from '../../deferredActions/DiscardEggForWildFood';

export class BlackCrownedNightHeron extends BirdCard {
  readonly name = BirdCardName.BLACK_CROWNED_NIGHT_HERON;
  readonly commonName = 'Black-Crowned Night-Heron';
  readonly scientificName = 'Nycticorax nycticorax';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FISH, FoodType.RODENT];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 112;
  readonly points = 9;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Discard 1 egg from any of your other birds to gain 1 wild from the supply.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new DiscardEggForWildFood(player, 1, this.powerText));
  }
}
