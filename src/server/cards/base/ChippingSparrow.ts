import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';

export class ChippingSparrow extends BirdCard {
  readonly name = BirdCardName.CHIPPING_SPARROW;
  readonly commonName = 'Chipping Sparrow';
  readonly scientificName = 'Spizella passerina';
  readonly habitats = [HabitatType.FOREST, HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.BOWL;
  readonly eggCapacity = 3;
  readonly wingspan = 23;
  readonly points = 1;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Lay 1 egg on any bird.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new LayEggs(player, 1));
  }
}
