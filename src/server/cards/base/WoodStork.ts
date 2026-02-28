import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class WoodStork extends BirdCard {
  readonly name = BirdCardName.WOOD_STORK;
  readonly commonName = 'Wood Stork';
  readonly scientificName = 'Mycteria americana';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.FISH, FoodType.RODENT, FoodType.WILD];
  readonly nestType = NestType.PLATFORM;
  readonly eggCapacity = 2;
  readonly wingspan = 155;
  readonly points = 6;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(_player: Player, _game: Game): void {
    // TODO: Draw 2 bonus cards and keep 1 - requires bonus card draw system
  }
}
