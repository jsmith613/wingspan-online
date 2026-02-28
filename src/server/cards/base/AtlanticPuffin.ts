import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class AtlanticPuffin extends BirdCard {
  readonly name = BirdCardName.ATLANTIC_PUFFIN;
  readonly commonName = 'Atlantic Puffin';
  readonly scientificName = 'Fratercula arctica';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.FISH, FoodType.FISH];
  readonly nestType = NestType.WILD;
  readonly eggCapacity = 1;
  readonly wingspan = 53;
  readonly points = 8;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(_player: Player, _game: Game): void {
    // TODO: Draw 2 bonus cards and keep 1 - requires bonus card draw system
  }
}
