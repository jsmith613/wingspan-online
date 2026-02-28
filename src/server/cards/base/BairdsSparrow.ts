import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';

export class BairdsSparrow extends BirdCard {
  readonly name = BirdCardName.BAIRDS_SPARROW;
  readonly commonName = 'Baird\'s Sparrow';
  readonly scientificName = 'Ammodramus bairdii';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 2;
  readonly wingspan = 23;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Lay 1 egg on any bird.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new LayEggs(player, 1));
  }
}
