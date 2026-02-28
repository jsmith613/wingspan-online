import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class EasternPhoebe extends BirdCard {
  readonly name = BirdCardName.EASTERN_PHOEBE;
  readonly commonName = 'Eastern Phoebe';
  readonly scientificName = 'Sayornis phoebe';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.WILD;
  readonly eggCapacity = 4;
  readonly wingspan = 28;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players gain 1 invertebrate from the supply.';

  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      p.addFood(FoodType.INVERTEBRATE);
    }
  }
}
