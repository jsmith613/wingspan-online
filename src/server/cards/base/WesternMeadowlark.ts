import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';

export class WesternMeadowlark extends BirdCard {
  readonly name = BirdCardName.WESTERN_MEADOWLARK;
  readonly commonName = 'Western Meadowlark';
  readonly scientificName = 'Sturnella neglecta';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 4;
  readonly wingspan = 38;
  readonly points = 2;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players lay 1 egg on any 1 ground bird. You may lay 1 egg on 1 additional ground bird.';

  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      game.deferredActions.push(new LayEggs(p, 1));
    }
  }
}
