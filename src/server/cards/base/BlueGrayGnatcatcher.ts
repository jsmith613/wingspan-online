import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class BlueGrayGnatcatcher extends BirdCard {
  readonly name = BirdCardName.BLUE_GRAY_GNATCATCHER;
  readonly commonName = 'Blue-Gray Gnatcatcher';
  readonly scientificName = 'Polioptila caerulea';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 15;
  readonly points = 1;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Gain 1 invertebrate from the supply.';

  onActivate(player: Player, _game: Game): void {
    player.addFood(FoodType.INVERTEBRATE);
  }
}
