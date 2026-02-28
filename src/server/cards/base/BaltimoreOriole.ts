import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class BaltimoreOriole extends BirdCard {
  readonly name = BirdCardName.BALTIMORE_ORIOLE;
  readonly commonName = 'Baltimore Oriole';
  readonly scientificName = 'Icterus galbula';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT, FoodType.FRUIT];
  readonly nestType = NestType.WILD;
  readonly eggCapacity = 2;
  readonly wingspan = 30;
  readonly points = 9;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players gain 1 fruit from the supply.';

  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      p.addFood(FoodType.FRUIT);
    }
  }
}
