import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';

export class CassinsSparrow extends BirdCard {
  readonly name = BirdCardName.CASSINS_SPARROW;
  readonly commonName = 'Cassin\'s Sparrow';
  readonly scientificName = 'Peucaea cassinii';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 2;
  readonly wingspan = 20;
  readonly points = 3;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Lay 1 egg on any bird.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new LayEggs(player, 1));
  }
}
