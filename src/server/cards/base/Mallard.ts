import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawCards } from '../../deferredActions/DrawCards';

export class Mallard extends BirdCard {
  readonly name = BirdCardName.MALLARD;
  readonly commonName = 'Mallard';
  readonly scientificName = 'Anas platyrhynchos';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 4;
  readonly wingspan = 89;
  readonly points = 0;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Draw 1 card.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new DrawCards(player, 1));
  }
}
