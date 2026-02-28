import { BirdCard } from '../BirdCard';
import { BirdCardName } from '../../../common/cards/BirdCardName';
import { FoodType } from '../../../common/game/FoodType';
import { NestType } from '../../../common/game/NestType';
import { HabitatType } from '../../../common/game/HabitatType';
import { PowerType } from '../../../common/game/PowerType';
import type { Player } from '../../Player';
import type { Game } from '../../Game';

export class WhoopingCrane extends BirdCard {
  readonly name = BirdCardName.WHOOPING_CRANE;
  readonly commonName = 'Whooping Crane';
  readonly scientificName = 'Grus americana';
  readonly habitats = [HabitatType.WETLAND];
  readonly foodCost = [FoodType.WILD, FoodType.WILD, FoodType.WILD];
  readonly nestType = NestType.GROUND;
  readonly eggCapacity = 1;
  readonly wingspan = 221;
  readonly points = 6;
  readonly powerType = PowerType.WHITE;
  readonly powerText = 'Draw 2 new bonus cards and keep 1.';

  onPlay(_player: Player, _game: Game): void {
    // TODO: Draw 2 bonus cards and keep 1 - requires bonus card draw system
  }
}
