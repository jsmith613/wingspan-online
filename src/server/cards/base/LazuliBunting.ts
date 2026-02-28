import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';

export class LazuliBunting extends BirdCard {
  readonly name = BirdCardName.LAZULI_BUNTING;
  readonly commonName = 'Lazuli Bunting';
  readonly scientificName = 'Passerina amoena';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED, FoodType.FRUIT];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 4;
  readonly wingspan = 23;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players lay 1 egg on any 1 bowl bird. You may lay 1 egg on 1 additional bowl bird.';

  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      game.deferredActions.push(new LayEggs(p, 1));
    }
  }
}
