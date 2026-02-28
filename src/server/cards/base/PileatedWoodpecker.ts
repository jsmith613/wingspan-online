import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { LayEggs } from '../../deferredActions/LayEggs';

export class PileatedWoodpecker extends BirdCard {
  readonly name = BirdCardName.PILEATED_WOODPECKER;
  readonly commonName = 'Pileated Woodpecker';
  readonly scientificName = 'Dryocopus pileatus';
  readonly habitats = [HabitatType.FOREST];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.FRUIT];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 2;
  readonly wingspan = 74;
  readonly points = 4;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'All players lay 1 egg on any 1 cavity bird. You may lay 1 egg on 1 additional cavity bird.';

  onActivate(_player: Player, game: Game): void {
    for (const p of game.getPlayers()) {
      game.deferredActions.push(new LayEggs(p, 1));
    }
  }
}
