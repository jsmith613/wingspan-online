import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DiscardEggToDrawCards } from '../../deferredActions/DiscardEggToDrawCards';

export class Killdeer extends BirdCard {
  readonly name = BirdCardName.KILLDEER;
  readonly commonName = 'Killdeer';
  readonly scientificName = 'Charadrius vociferus';
  readonly habitats = [HabitatType.GRASSLAND, HabitatType.WETLAND];
  readonly foodCost = [FoodType.INVERTEBRATE, FoodType.SEED];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 3;
  readonly wingspan = 46;
  readonly points = 1;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Discard 1 egg to draw 2 card.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(
      new DiscardEggToDrawCards(player, 2, 'Optional: discard 1 egg to draw 2 cards, or skip.'),
    );
  }
}
