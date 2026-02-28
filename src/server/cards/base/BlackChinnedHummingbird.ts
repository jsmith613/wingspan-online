import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class BlackChinnedHummingbird extends BirdCard {
  readonly name = BirdCardName.BLACK_CHINNED_HUMMINGBIRD;
  readonly commonName = 'Black-Chinned Hummingbird';
  readonly scientificName = 'Archilochus alexandri';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.WILD];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 2;
  readonly wingspan = 8;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players gain 1 fruit from the supply.';

  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      p.addFood(FoodType.FRUIT);
    }
  }
}
