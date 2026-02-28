import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';
import { DrawCards } from '../../deferredActions/DrawCards';

/**
 * Chimney Swift - Brown power: Draw 1 card.
 * Habitats: Grassland. Nest: Cavity. Eggs: 2. Wingspan: 31cm. Points: 1.
 * Food: Invertebrate.
 */
export class ChimneySwift extends BirdCard {
  readonly name = BirdCardName.CHIMNEY_SWIFT;
  readonly commonName = 'Chimney Swift';
  readonly scientificName = 'Chaetura pelagica';
  readonly habitats = [HabitatType.GRASSLAND];
  readonly foodCost = [FoodType.INVERTEBRATE];
  readonly nestType = NestType.CAVITY;
  readonly eggCapacity = 2;
  readonly wingspan = 31;
  readonly points = 1;
  readonly powerType = PowerType.BROWN;
  readonly powerText = 'Draw 1 card.';

  onActivate(player: Player, game: Game): void {
    game.deferredActions.push(new DrawCards(player, 1));
  }
}
